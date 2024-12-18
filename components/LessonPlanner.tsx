'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import Selector from './Selector';

import { fileExtractor } from '@utils/fileTextExtractor';

import { useFileUpload } from '@utils/useFileUpload';

import { sendLessonPlannerRequest } from '@app/lib/api/lessonPlanner';

import aiImage from '../public/assets/icons/ai-logo.svg';
import uploadIcon from '../public/assets/icons/upload.svg';

const grades = ['1st grade', '2nd grade', '3rd grade', '4th grade'];

const minutes = ['60', '120', '180', '200'];

export interface LessonData {
  topic: string;
  duration: string;
  grade_level: string;
}

export const LessonPlanner = () => {
  const [selectedGrade, setSelectedGrade] = useState(grades[0]);
  const [duration, setDuration] = useState(minutes[0]);
  const [topic, setTopic] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [aiReponse, setAiResponse] = useState('');

  const { file, error, handleFileChange, setFile, handleRemoveUploadedItem } =
    useFileUpload();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTopicChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTopic(event.target.value);
  };

  const triggerFileInput = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmitForm = async () => {
    setIsLoading(true);
    let extractedTextFromPdf = null;

    if (file) {
      extractedTextFromPdf = await fileExtractor(file);
    }

    const data: LessonData = {
      topic,
      duration,
      grade_level: selectedGrade[0],
    };

    if (extractedTextFromPdf) {
      data.topic += `${extractedTextFromPdf}`;
    }

    try {
      const response = await sendLessonPlannerRequest(data);

      setAiResponse(response);
    } catch (error) {
      console.error('Error during request:', error);
    } finally {
      setSelectedGrade(grades[0]);
      setDuration(minutes[0]);
      setTopic('');
      setFile(null);

      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white px-4 py-4 rounded-3xl w-[662px] border">
      <div className="mb-6">
        <Image src={aiImage} alt="ai-image" priority />
      </div>
      <div>
        <div className="text-2xl text-black font-semibold">Lesson Planner</div>
        <div className="text-base mb-6 text-gray-400">
          This AI tool helps you with creating lesson plans for your class!
        </div>
        <div></div>
        <div className="mb-3">
          <Selector
            label="Grade level:"
            options={grades}
            selectedOption={selectedGrade}
            onChange={setSelectedGrade}
          />
        </div>
        <div className="mb-3">
          <Selector
            label="Lecture duration (in minutes)"
            options={minutes}
            selectedOption={duration}
            onChange={setDuration}
          />
        </div>
        <div className="text-black text-base mb-1 font-semibold">
          Topic, Standart or Objective:
        </div>
        <div className="text-sm text-gray-400 mb-1">
          Provide how the assignment should open the conversation
        </div>
        <textarea
          className="w-full mb-2 rounded-3xl border py-3 px-6 h-[150px] overflow-y-auto resize-none outline-none text-[14px]"
          placeholder="Student last lesson was on the geography of the United States, have the lesson include group work, etc. The lesson plan should include standards (CCSS, TEKS)"
          value={topic}
          onChange={handleTopicChange}
        />
        <div className="mb-6">
          <div className="text-gray-700 text-sm mb-1">
            Upload additional documents
          </div>
          {error && <div className="text-sm text-red-400">{error}</div>}
          <div className="h-[156px] border border-dashed rounded-3xl flex justify-center items-center">
            {file ? (
              <div className="px-5 py-3 border rounded-xl flex gap-5 items-center">
                {file.name}
                <div
                  className="text-xs cursor-pointer"
                  onClick={handleRemoveUploadedItem}
                >
                  &#x2715;
                </div>
              </div>
            ) : (
              <div className="w-60 text-center flex flex-col justify-center items-center">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept=".pdf,.docx,.pptx,.txt,.html"
                />
                <button
                  className="bg-black mb-2 rounded-xl text-white text-base py-3 pr-7 pl-6 flex items-center gap-3"
                  onClick={triggerFileInput}
                >
                  <Image
                    src={uploadIcon}
                    height={18}
                    width={28}
                    alt="Upload Icon"
                  />
                  Upload a file
                </button>
                <div className="text-sm text-gray-400">
                  <div> Max. file size 50 MB</div>
                  <div>(PDF, DOCX, PPTX, TXT, HTML)</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {aiReponse && (
          <div className="mb-6">
            <div className="text-gray-700 text-sm mb-1">AI response:</div>
            <div className="border rounded-xl p-4">{aiReponse}</div>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <button
            className="bg-black w-full py-5 text-white text-base rounded-full"
            onClick={handleSubmitForm}
          >
            {isLoading ? `Loading...` : `Create lesson plan`}
          </button>
          <Link href="/" className="text-red-500 w-full text-center py-2.5">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};
