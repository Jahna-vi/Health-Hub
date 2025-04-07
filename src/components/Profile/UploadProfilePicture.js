import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { uploadProfilePictureBase64 } from '../../services/api' // update this
import { Container, Button, Typography, Paper, Box, Input } from '@mui/material'

const UploadProfilePicture = () => {
  const [preview, setPreview] = useState('')
  const [base64Image, setBase64Image] = useState('')
  const { userData } = useAuth()

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        const base64 = reader.result.split(',')[1]
        setBase64Image(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!base64Image || !userData?.id) return alert('Please select an image.')

    try {
      const response = await uploadProfilePictureBase64(
        userData.id,
        base64Image
      )
      console.log(response.data)
      alert('Profile picture uploaded successfully')
    } catch (error) {
      console.error(error)
      alert('Failed to upload profile picture')
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Upload Profile Picture
        </Typography>
        <form onSubmit={handleSubmit}>
          <Input
            type="file"
            onChange={handleChange}
            fullWidth
            inputProps={{ accept: 'image/*' }}
          />
          {preview && (
            <Box mt={2} textAlign="center">
              <img
                src={preview}
                alt="Preview"
                style={{ width: '150px', borderRadius: '50%' }}
              />
            </Box>
          )}
          <Box mt={2} display="flex" justifyContent="center">
            <Button type="submit" variant="contained" color="primary">
              Upload Picture
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  )
}

export default UploadProfilePicture
