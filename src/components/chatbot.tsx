'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import axios from 'axios'
import { Download, Plus, Send } from 'lucide-react'
import { useState } from 'react'


type Message = {
    role: 'user' | 'ai'
    content: string
    image?: string
}

export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isImageGeneration, setIsImageGeneration] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    console.log(messages)

    const handleSend = async () => {
        if (!input.trim()) return

        const newMessage: Message = { role: 'user', content: input }
        setMessages(prev => [...prev, newMessage])
        setInput('')
        setIsLoading(true)

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { status, data: body } = await axios.post('/api/chatbot', { message: input, isImageGeneration, messages })
            // const body = await ApiResponse(input, isImageGeneration);
            console.log(body)
            const aiMessage: Message = {
                role: 'ai',
                content: body.text,
                image: body.image
            }
            setMessages(prev => [...prev, aiMessage])
            console.log(messages)
        } catch (error) {
            console.error('Error fetching response:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleNewSession = () => {
        if (window.confirm('Starting a new session will wipe all chat history. Are you sure?')) {
            setMessages([])
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto h-[90%] flex flex-col my-4">
            <CardContent className="flex flex-col h-full p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">AI Chatbot</h2>
                    <Button variant="outline" size="icon" onClick={handleNewSession}>
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">New Session</span>
                    </Button>
                </div>
                <ScrollArea className="flex-grow mb-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                            <div className={`flex items-start gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <Avatar>
                                    <AvatarFallback>{message.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                                </Avatar>
                                <div className={`rounded-lg p-2 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p>{message.content}</p>
                                    {message.image && (
                                        <div className="mt-2">
                                            <img src={message.image} alt="Generated" className="rounded-md max-w-full" />
                                            <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open(message.image, '_blank')}>
                                                <Download className="h-4 w-4 mr-2" /> Download
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
                <div className="flex items-center gap-2 mb-2">
                    <Switch
                        id="image-mode"
                        checked={isImageGeneration}
                        onCheckedChange={setIsImageGeneration}
                    />
                    <Label htmlFor="image-mode">Generate Image</Label>
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder={isImageGeneration ? "Describe the image..." : "Type a message..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button onClick={handleSend} disabled={isLoading}>
                        {isLoading ? "Sending..." : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}