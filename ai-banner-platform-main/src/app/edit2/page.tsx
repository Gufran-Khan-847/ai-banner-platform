'use client'

import Chatbot from '@/components/chatbot'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor'

export default function EditPage() {
    const searchParams = useSearchParams()
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentImage, setCurrentImage] = useState(1)

    const getImageSavedPath = async (url: string) => {
        const response = await fetch('/api/s3', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        })

        const data = await response.json()
        const path = data.filePath
        console.log(data)
        setImageUrl(decodeURIComponent(path.substring(6)))
    }

    useEffect(() => {
        const getImage = async () => {
            const image = searchParams.get('image')
            if (image) {
                await getImageSavedPath(image)
            }
        }
        getImage()
    }, [searchParams])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSave = (editedImageObject: any) => {
        if (editedImageObject && editedImageObject.imageBase64) {
            const link = document.createElement('a')
            link.href = editedImageObject.imageBase64
            link.download = 'edited-image.png'
            link.click()
            window.close()
        }
    }

    const openModal = () => {
        setIsModalOpen(true)
        setCurrentImage(1)
        setTimeout(() => {
            setCurrentImage(2)
        }, 8000)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    if (!imageUrl) {
        return <div>Loading...</div>
    }

    return (
        <div className='flex flex-col h-screen'>
            <div className='flex-grow flex'>
                <div className="w-2/3 h-full relative">
                    <FilerobotImageEditor
                        source={imageUrl}
                        onSave={handleSave}
                        onClose={() => window.close()}
                        annotationsCommon={{
                            fill: '#ff0000',
                        }}
                        Text={{ text: 'Text here' }}
                        Rotate={{ angle: 90, componentType: 'slider' }}
                        Crop={{
                            presetsItems: [
                                {
                                    titleKey: 'classicTv',
                                    descriptionKey: '4:3',
                                    ratio: 4 / 3,
                                    icon: 'crop-4-3',
                                },
                                {
                                    titleKey: 'widescreenTv',
                                    descriptionKey: '16:9',
                                    ratio: 16 / 9,
                                    icon: 'crop-16-9',
                                },
                            ],
                            presetsFolders: [
                                {
                                    titleKey: 'socialMedia',
                                    groups: [
                                        {
                                            titleKey: 'facebook',
                                            items: [
                                                {
                                                    titleKey: 'profile',
                                                    width: 180,
                                                    height: 180,
                                                    descriptionKey: 'fbProfileSize',
                                                },
                                                {
                                                    titleKey: 'coverPhoto',
                                                    width: 820,
                                                    height: 312,
                                                    descriptionKey: 'fbCoverPhotoSize',
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        }}
                        tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK]}
                        defaultTabId={TABS.ANNOTATE}
                        defaultToolId={TOOLS.TEXT}
                        savingPixelRatio={0}
                        previewPixelRatio={0}
                    />
                    <Button
                        className="absolute bottom-4 left-4 z-10"
                        onClick={openModal}
                    >
                        Replace with original product
                    </Button>
                </div>
                <div className='w-1/3'>
                    <Chatbot />
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
                        <h2 className="text-2xl font-bold mb-4">Replacing with original product</h2>
                        <div className="relative w-full h-96">
                            <Image
                                src={imageList[currentImage - 1]}
                                alt={`Image ${currentImage}`}
                                className={currentImage == 1 ? "animate-pulse" : ""}
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={closeModal}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}