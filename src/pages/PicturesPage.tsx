import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Image } from 'lucide-react';
import { galleryImages } from '../data/mockData';

const PicturesPage: React.FC = () => {
  const [index, setIndex] = useState(-1);

  const photos = galleryImages.map(image => ({
    src: image.src,
    width: image.width,
    height: image.height,
    alt: image.title
  }));

  const slides = galleryImages.map(image => ({
    src: image.src,
    alt: image.title
  }));

  const openLightbox = useCallback((_, { index }: { index: number }) => {
    setIndex(index);
  }, []);

  const closeLightbox = () => {
    setIndex(-1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Image className="h-6 w-6 text-teal-600" />
        <h1 className="text-2xl font-bold text-gray-800">Fotogalerie</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-600 mb-6">
          Fotos von der Wohnung
        </p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <PhotoAlbum 
            photos={photos} 
            layout="rows" 
            targetRowHeight={250}
            onClick={openLightbox}
            spacing={8}
            sizes={{ size: "calc(100vw - 240px)" }}
          />
          
          <Lightbox
            slides={slides}
            open={index >= 0}
            index={index}
            close={closeLightbox}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PicturesPage;