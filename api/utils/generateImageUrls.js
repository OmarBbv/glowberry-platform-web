const generateImageUrls = (files, req, folder = "uploads") => {
    return files.map(file => {
        return `${req.protocol}://${req.get('host')}/${folder}/${file.filename}`;
    });
};

export default generateImageUrls
