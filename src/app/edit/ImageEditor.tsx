import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor'

interface ImageEditorProps {
    imageUrl: string
    onSave: (editedImageUrl: string) => void
    onClose: () => void
}

export default function ImageEditor({ imageUrl, onSave, onClose }: ImageEditorProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full h-full max-w-4xl max-h-[90vh]">
                <FilerobotImageEditor
                    source={imageUrl}
                    onSave={(editedImageObject) => {
                        if (editedImageObject && editedImageObject.imageBase64) {
                            onSave(editedImageObject.imageBase64)
                        }
                    }}
                    onClose={onClose}
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
                    defaultToolId={TOOLS.TEXT} savingPixelRatio={0} previewPixelRatio={0} />
            </div>
        </div>
    )
}