import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  recommendations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recommendation",
    },
  ],
  chatRecords: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
  loginScreenshot: {
    type: String,
  },

  // Experiment fields
  displayChatBox: {
    type: Boolean,
    default: false,
  },
  displayWarningMessage: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String, // "pert-left" or "pert-right" or "follow-left" or "follow-right"
    default: "blank",
  },
  batch: {
    type: String, // "pilot-0"
  },
  chatBotStance: {
    type: String, // "left" or "right"
    default: "neutral",
  },
  assignedEmail: {
    type: String,
  },
  assignedPassword: {
    type: String,
  },
  assignedRecoveryEmail: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
