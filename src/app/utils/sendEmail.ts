import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
});

interface ISendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, string>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmailOptions = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: ISendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments,
    });

    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    throw new AppError(400, "Email error.");
  }
};
