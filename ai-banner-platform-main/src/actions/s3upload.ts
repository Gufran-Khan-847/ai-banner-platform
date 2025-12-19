"use server"

export const uploadUsingPresignedUrl = async (file: File, fileName: string, url: string) => {
    try {
        await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}