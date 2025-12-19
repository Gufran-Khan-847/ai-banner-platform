"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useState } from 'react'
import ImageEditor from './ImageEditor'

// Dummy image URL with text
const DUMMY_IMAGE_URL = 'https://dummyimage.com/600x400/000/fff&text=Edit+This+Banner'

export default function ChatInterface() {
    const [messages, setMessages] = useState<string[]>([])
    const [input, setInput] = useState('')
    const [generatedImage, setGeneratedImage] = useState(DUMMY_IMAGE_URL)
    const [isEditing, setIsEditing] = useState(false)

    const handleSendMessage = async () => {
        if (input.trim()) {
            setMessages([...messages, `User: ${input}`])
            // Simulate a response (replace with actual API call in a real application)
            setTimeout(() => {
                setMessages(prev => [...prev, `Bot: Here's a generated image based on "${input}"`])
                setGeneratedImage(DUMMY_IMAGE_URL) // In a real app, this would be the URL of the generated image
            }, 1000)
            setInput('')
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setGeneratedImage(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleEditImage = () => {
        setIsEditing(true)
    }

    const handleSaveEditedImage = (editedImageUrl: string) => {
        setGeneratedImage(editedImageUrl)
        // download the image
        const link = document.createElement('a')
        link.download = 'edited-image.png'
        setIsEditing(false)
        setMessages(prev => [...prev, "User: I've edited the image"])
        // Here you can also send the edited image back to your backend if needed
    }

    const handleCloseEditor = () => {
        setIsEditing(false)
    }

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto">
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div key={index} className="p-2 rounded bg-gray-100">
                        {message}
                    </div>
                ))}
                {generatedImage && !isEditing && (
                    <div className="space-y-2">
                        <img src={generatedImage} alt="Generated Banner" className="max-w-full h-auto rounded" />
                        <Button onClick={handleEditImage}>Edit Image</Button>
                    </div>
                )}
            </div>
            <div className="p-4 border-t">
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-2"
                />
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>Send</Button>
                </div>
            </div>
            {isEditing && (
                <ImageEditor
                    imageUrl={generatedImage}
                    onSave={handleSaveEditedImage}
                    onClose={handleCloseEditor}
                />
            )}
        </div>
    )
}