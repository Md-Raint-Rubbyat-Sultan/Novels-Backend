import mongoose from "mongoose";
import { TError } from "../interfaces/globalErrorHandler";

export const handleCastError = (error: mongoose.Error.CastError): TError => {
  return {
    statusCode: 400,
    message: "Invalied MongoDB id. Please provide a valied id.",
  };
};
