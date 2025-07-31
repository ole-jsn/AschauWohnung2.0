import React from 'react';
import { motion } from 'framer-motion';
import { Info, MapPin, Check } from 'lucide-react';
import { propertyInfo } from '../data/mockData';

const InfoPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Info className="h-6 w-6 text-teal-600" />
        <h1 className="text-2xl font-bold text-gray-800">Informationen zur Wohnung</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <motion.div 
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {propertyInfo.title}
            </h2>
            <div className="flex items-start mb-4">
              <MapPin className="h-5 w-5 text-teal-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-gray-600">
                {propertyInfo.location.address}, {propertyInfo.location.city}, {propertyInfo.location.zipCode}, {propertyInfo.location.country}
              </p>
            </div>
            <p className="text-gray-700 whitespace-pre-line">
              {propertyInfo.description}
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ausstattung</h2>
            <ul className="grid grid-cols-2 gap-y-2">
              {propertyInfo.amenities.map((amenity, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-teal-600 mr-2" />
                  <span className="text-gray-700">{amenity}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          className="bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Video</h2>
            <p className="text-gray-600 mb-4">
              Hier vlt ein Video
            </p>
          </div>
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={propertyInfo.videoUrl}
              title="Video der Wohnung"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InfoPage;