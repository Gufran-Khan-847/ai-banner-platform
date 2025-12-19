'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit2, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function BannerCraft() {
    const [prompt, setPrompt] = useState("Fuzzy polar bear plushie sleeping in a minimalist modern apartment bed")
    const [images, setImages] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 3000))
        const generatedImages = Array(4).fill('').map((_, i) => `/placeholder.svg?height=512&width=512&text=Generated+Image+${i + 1}`)
        setImages(generatedImages)
        setIsLoading(false)
    }

    const handleLucky = async () => {
        setPrompt("Surprise me with a random image!")
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 3000))
        const generatedImages = Array(4).fill('').map((_, i) => `/placeholder.svg?height=512&width=512&text=Lucky+Image+${i + 1}`)
        setImages(generatedImages)
        setIsLoading(false)
    }

    const handleEdit = (imageUrl: string) => {
        const editorUrl = `/edit?image=${encodeURIComponent(imageUrl)}`
        window.open(editorUrl, '_blank')
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4">
            <h1 className="text-2xl font-bold mb-4">BannerCraft</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full h-32"
                            placeholder="Enter your image prompt here..."
                        />
                        <div className="flex items-center gap-2">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate'
                                )}
                            </Button>
                            <Button type="button" onClick={handleLucky} disabled={isLoading} variant="outline">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Feeling Lucky...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                        I&apos;m feeling lucky
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {['35mm film', 'minimal', 'sketchy', 'handmade', 'abstract', 'chiaroscuro'].map((tag) => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="flex flex-col">
                            <div className="aspect-square bg-muted rounded-t overflow-hidden">
                                <img src={image} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                            <Button
                                variant="secondary"
                                className="w-full rounded-t-none"
                                onClick={() => handleEdit(image)}
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}