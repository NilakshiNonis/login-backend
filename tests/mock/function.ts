
import { User } from "../../src/models/user.model";


export const removeTestUsers = async () => {
  return await User.destroy({
    where: {
      name: "test",
    },
  });
};

export const addTestUser = async (payload: any) => {
  return await User.create(payload);
};
