const User = require('../models/userModel')


// Middleware to handle file upload and profile picture update
// Update profile picture using base64 image string
exports.uploadProfilePicture = async (req, res) => {
  const { userId } = req.params
  const { profilePicture } = req.body // base64 image string

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!profilePicture) {
      return res
        .status(400)
        .json({ message: 'Profile picture (base64) is required' })
    }

    user.profilePicture = profilePicture
    await user.save()

    res
      .status(200)
      .json({ message: 'Profile picture updated successfully', user })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}


// Controller to update user profile
exports.updateProfile = async (req, res) => {
  const { userId, username, email, phoneNumber, medicalId } = req.body

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.username = username || user.username
    user.email = email || user.email
    user.phoneNumber = phoneNumber || user.phoneNumber
    user.medicalId = medicalId || user.medicalId

    await user.save()

    res.status(200).json({ message: 'Profile updated successfully', user })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

// Controller to get user profile by ID
exports.getProfile = async (req, res) => {
  const { userId } = req.params

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ user })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}
