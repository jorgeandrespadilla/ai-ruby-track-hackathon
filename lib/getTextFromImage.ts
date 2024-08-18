import vision from '@google-cloud/vision';

export const getTextFromImage = async (url: string) => {
    const client = new vision.ImageAnnotatorClient();

    const [result] = await client.textDetection(url);
    const detections = result.textAnnotations;
    if (detections && detections.length > 0) {
        console.log('Text:', detections[0].description);
        return detections[0].description;
    } else {
        return '';
    }
}



