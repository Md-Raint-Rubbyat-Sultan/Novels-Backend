import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdmin = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdmin) {
      console.log("Super admin already exist.");
      return;
    }

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const superAdminPayload: IUser = {
      name: "Super_Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: envVars.SUPER_ADMIN_PASSWORD,
      role: Role.SUPER_ADMIN,
      isVarified: true,
      auth: [authProvider],
      subscribe: false,
      subscriptionType: null,
      subscriptionDate: null,
      subscriptionExpires: null,
    };

    const superAdmin = await User.create(superAdminPayload);

    console.log(superAdmin);
  } catch (error) {
    console.log(error);
    throw new AppError(400, "Faild to create super admin.");
  }
};
