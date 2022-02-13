const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
    blogs: {
      type: [schema.Types.ObjectId],
      default: [],
      ref: "Blog",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// userSchema.pre("save", async function (next) {
//   try {
//     console.log("password", this.password);
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(this.password, salt);
//     this.password = hashedPassword;
//     next();
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// });

module.exports = User;
