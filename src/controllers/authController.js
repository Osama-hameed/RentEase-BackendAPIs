import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";


const commonPasswords = ["password", "123456", "qwerty", "admin"];
function isPasswordValid(password) {
    return password.length >= 8 && password.length <= 20;
}
function isNotCommonPassword(password) {
    return !commonPasswords.includes(password.toLowerCase());
}

function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

function hasRequiredCharacters(password) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNonAlphabet = /[^a-zA-Z]/.test(password);

    return hasUppercase && hasLowercase && hasNonAlphabet;
}

function removeTrailingSpaces(password) {
    return password.trim();
}

export const registerController = async (req, res) => {
  try {
    console.log(req.body); // Add this line before destructuring
    const { userid, username, password } = req.body;

    const existingUser = await userModel.findOne({ username});
    const passwordWithoutTrailingSpaces = removeTrailingSpaces(password);
    
    //validations
    if (!userid) {
      return res.send({ error: "Userid is required." });
    }
    if (!username) {
      return res.send({ error: "Username is required." });
    }
    if (!password) {
      return res.send({ message: "Password is required." });
    }
    if(existingUser){
        return res.status(400).json({message: "User already exists, please login."});
    }
    if(!isPasswordValid(passwordWithoutTrailingSpaces) || !isNotCommonPassword(passwordWithoutTrailingSpaces)){
        return res.status(400).json({message: "Password is invalid"});
    }
    if(!hasRequiredCharacters(passwordWithoutTrailingSpaces)){
        return res.status(400).json({message: "Password is invalid"});
    }

    const hashedPassword = await hashPassword(passwordWithoutTrailingSpaces);
    //save
    const user = await new userModel({
      userid,
      username,
      password: hashedPassword,
    }).save();
    const userWithoutPassword = {
      _id: user._id,
      userid: user.userid,
      username: user.username,
    };
    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
}; 

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { password, userid } = await req.body;

    //validation
    if (!userid || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ userid });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        userid: user.userid,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    const passwordWithoutTrailingSpaces = removeTrailingSpaces(newPassword);

    if (!username) {
      res.status(400).send({ message: "User is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    if(!isPasswordValid(passwordWithoutTrailingSpaces) || !isNotCommonPassword(passwordWithoutTrailingSpaces)){
        return res.status(400).json({message: "Password is invalid"});
    }
    if(!hasRequiredCharacters(passwordWithoutTrailingSpaces)){
        return res.status(400).json({message: "Password is invalid"});
    }

    //check
    const user = await userModel.findOne({ username });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User doesnot exist.",
      });
    }
    const hashed = await hashPassword(passwordWithoutTrailingSpaces);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};


//delete
export const deleteUserController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.U_id);
    res.status(200).send({
      success: true,
      message: "User Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting user",
      error,
    });
  }
};

//update user
export const updateUserController = async (req, res) => {
  try {
    const {
      userid,
      username,
      designation,
      department,
      firstLineManager,
      secondLineManager,
      lineDirector,
    } = req.body;
    //alidation
    switch (true) {
      case !userid:
        return res.status(500).send({ error: "Userid is Required" });
      case !username:
        return res.status(500).send({ error: "Username is Required" });
      case !designation:
        return res.status(500).send({ error: "Designation is Required" });
      case !department:
        return res.status(500).send({ error: "Department is Required" });
      case !firstLineManager:
        return res
          .status(500)
          .send({ error: "First Line Manager is Required" });
      case !secondLineManager:
        return res
          .status(500)
          .send({ error: "Second Line Manager is Required" });
      case !lineDirector:
        return res
          .status(500)
          .send({ error: "Line Vice President is Required" });
    }

    const user = await userModel.findByIdAndUpdate(
      req.params.U_id,
      { ...req.body },
      { new: true },
      { password: 0 }
    );
    await user.save();
    res.status(201).send({
      success: true,
      message: "User Updated Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updating user",
    });
  }
};
//GETTING getting single user
export const singleUserController = async (req, res) => {
  try {
    //const fm="firstLineManager";
    const userid = req.params.id;
    const user = await userModel.findOne({ userid }, { password: 0 });

    const firstLineManager = await userModel.findOne(
      { userid: user.firstLineManager },
      { password: 0 }
    );
    const secondLineManager = await userModel.findOne(
      { userid: user.secondLineManager },
      { password: 0 }
    );
    const lineDirector = await userModel.findOne(
      { userid: user.lineDirector },
      { password: 0 }
    );
    res.status(200).send({
      success: true,
      message: "SINGLE USERS ",
      user,
      firstLineManager,
      secondLineManager,
      lineDirector,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting user",
      error: error.message,
    });
  }
};
//GETTING all USER
export const getUserController = async (req, res) => {
  try {
    const users = await userModel
      .find({ role: 0 }, { password: 0 })
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: users.length,
      message: "ALL USERS ",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting users",
      error: error.message,
    });
  }
};