import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';

const CalendarPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <CalendarIcon className="h-6 w-6 text-teal-600" />
        <h1 className="text-2xl font-bold text-gray-800">Kalender</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-4">
        <p className="text-gray-600 mb-4">
          Kalender zur Verfügbarkeit der Wohnung. Alle Termine werden im Kalender angezeigt.
        </p>
        
        <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200">
          <iframe
            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Europe%2FBerlin&showPrint=0&showTz=0&title=Aschau Kalender&src=ZDdmNDUzNzVlNTA4ODAwODcyYzlkNjg3YzkzNWRkNTAxYTJkYzI5OTQ2NzRkYjQwNTdjYTI0OTcxYTQzNWU4YUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZGUuZ2VybWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4uZ2VybWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23f4511e&color=%230b8043&color=%230b8043"
            width="800"
            height="600"
            frameBorder="0"
            scrolling="no"
            title="Availability Calendar"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarPage;