"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import Chatbot from "@/components/chatbot";
import { Button } from "@/components/ui/button";

// Dynamic import to avoid server-side require of `canvas` via konva
const FilerobotImageEditor = dynamic(
  () => import("react-filerobot-image-editor"),
  { ssr: false }
);

// Types from react-filerobot-image-editor
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { TABS, TOOLS } = require("react-filerobot-image-editor");

export default function EditPage() {
  const searchParams = useSearchParams();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<1 | 2>(1);

  const getImageSavedPath = async (url: string) => {
    const response = await fetch("/api/s3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    const path: string = data.filePath;
    console.log(data);

    // remove `s3://` or similar prefix if present
    setImageUrl(decodeURIComponent(path.substring(6)));
  };

  useEffect(() => {
    const getImage = async () => {
      const image = searchParams.get("image");
      if (image) {
        await getImageSavedPath(image);
      }
    };

    getImage();
  }, [searchParams]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = (editedImageObject: any) => {
    if (editedImageObject && editedImageObject.imageBase64) {
      const link = document.createElement("a");
      link.href = editedImageObject.imageBase64;
      link.download = "edited-image.png";
      link.click();
      window.close();
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentImage(1);

    setTimeout(() => {
      setCurrentImage(2);
    }, 8000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!imageUrl) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <span className="text-xl font-semibold">BannerCraft Editor</span>
        </div>
        <Chatbot />
      </header>

      <main className="flex flex-1 flex-col px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Edit Banner</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openModal}>
              Replace with original product
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden rounded-md border">
          <FilerobotImageEditor
            source={imageUrl}
            onSave={handleSave}
            annotationsCommon={{
              fill: "#ff0000",
            }}
            Text={{ text: "Text here" }}
            Rotate={{ angle: 90, componentType: "slider" }}
            Crop={{
              presetsItems: [
                {
                  titleKey: "classicTv",
                  descriptionKey: "4:3",
                  ratio: 4 / 3,
                  icon: "crop-4-3",
                },
                {
                  titleKey: "widescreenTv",
                  descriptionKey: "16:9",
                  ratio: 16 / 9,
                  icon: "crop-16-9",
                },
              ],
              presetsFolders: [
                {
                  titleKey: "socialMedia",
                  groups: [
                    {
                      titleKey: "facebook",
                      items: [
                        {
                          titleKey: "profile",
                          width: 180,
                          height: 180,
                          descriptionKey: "fbProfileSize",
                        },
                        {
                          titleKey: "coverPhoto",
                          width: 820,
                          height: 312,
                          descriptionKey: "fbCoverPhotoSize",
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
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => window.close()}>
            Close editor
          </Button>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold">
              Replacing with original product
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              The AI-generated product area is being replaced with the original
              uploaded product image to ensure 100% spelling and branding
              accuracy.
            </p>
            <div className="mb-4 flex justify-center">
              {currentImage === 1 ? (
                <Image
                  src="/ai-product-placeholder.png"
                  alt="AI generated product"
                  width={280}
                  height={180}
                />
              ) : (
                <Image
                  src="/original-product-placeholder.png"
                  alt="Original product"
                  width={280}
                  height={180}
                />
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={closeModal}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
