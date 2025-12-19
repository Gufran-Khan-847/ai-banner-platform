'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import { Edit2, Loader2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

export default function BannerCraft() {
    const [prompt, setPrompt] = useState("Fuzzy polar bear plushie sleeping in a minimalist modern apartment bed")
    const [images, setImages] = useState<string[]>([''])
    const [uploadedImages, setUploadedImages] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [colorPalette, setColorPalette] = useState<string[]>(['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF'])
    const [theme, setTheme] = useState('modern')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [apiKey, setApiKey] = useState('')
    const [tokensConsumed, setTokensConsumed] = useState(0)

    const getRandomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        const { data } = await axios.post('/api/genr', {
            userImgS3Links: uploadedImages,
            userPrompt: prompt,
            colorPallete: colorPalette,
            theme: theme
        })
        console.log(data)
        const imgs = data.body.images
        setImages(imgs)
        setIsLoading(false)
    }

    const handleLucky = async () => {
        setPrompt("Surprise me with a random image!")
        setIsLoading(true)

        setIsLoading(false)
    }

    const handleEdit = (imageUrl: string) => {
        const editorUrl = `/edit2?image=${encodeURIComponent(imageUrl)}`
        window.open(editorUrl, '_blank')
    }

    // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = event.target.files
    //     if (files) {
    //         const newUploadedImages = Array.from(files).map(file => URL.createObjectURL(file))
    //         setUploadedImages(prev => [...prev, ...newUploadedImages])

    //     }
    // }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const formData = new FormData();
            Array.from(files).forEach((file) => {
                formData.append('images', file);
            });

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                setUploadedImages(prev => [...prev, ...data.urls]);
            } catch (error) {
                console.error('Error uploading images:', error);
            }
        }
    };
    const handleColorChange = (index: number, color: string) => {
        setColorPalette(prev => {
            const newPalette = [...prev]
            newPalette[index] = color
            return newPalette
        })
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4">
            <h1 className="text-2xl font-bold mb-4">BannerCraft</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="image-upload">Upload Images</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden rounded-full"
                                    ref={fileInputRef}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Images
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {uploadedImages.map((img, index) => (
                                    <img key={index} src={img} alt={`Uploaded image ${index + 1}`} className=" h-64 object-fit rounded" />
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="color-palette">Color Palette</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-2">
                                {colorPalette.map((color, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            type="color"
                                            value={color}
                                            onChange={(e) => handleColorChange(index, e.target.value)}
                                            className="w-[35%]"
                                            placeholder="#RRGGBB or RGB"
                                        />
                                        <div
                                            className="w-auto p-1 px-2 bg-gray-100 flex items-center justify-center text-sm h-6 rounded-full border border-gray-300"
                                        >{color}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="theme">Theme</Label>
                            <Input
                                id="theme"
                                type="text"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="w-full"
                                placeholder="Enter a theme (e.g., modern, vintage, minimalist)"
                            />
                        </div>
                        <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full h-32"
                            placeholder="Enter your image prompt here..."
                        />
                        <div>
                            {/* api key input area */}
                            <div>
                                <Label htmlFor="api-key">API Key</Label>
                                <Input
                                    id="api-key"
                                    type="password" // Changed to password type for hidden input
                                    value={apiKey} // Add state for apiKey
                                    onChange={(e) => setApiKey(e.target.value)} // Add setApiKey function
                                    className="w-full"
                                    placeholder="Enter your API key"
                                />
                            </div>
                        </div>
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
                                        {
                                            tokensConsumed > 0
                                                ? `(${tokensConsumed} tokens consumed)`
                                                : ``
                                        }
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