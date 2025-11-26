import React, { useState } from 'react';
import { PreferenceSelector } from './components/PreferenceSelector';
import { ImageUpload } from './components/ImageUpload';
import { Preference, GenerationState } from './types';
import { generateTattooDesign } from './services/geminiService';
import { Wand2, AlertCircle, Share2, Download, ChevronRight } from 'lucide-react';

const INITIAL_PREFERENCES: Preference[] = [
  { id: '1', label: 'Triangle', active: true },
  { id: '2', label: 'Money', active: true },
  { id: '3', label: 'Risk', active: true },
  { id: '4', label: 'Progress', active: true },
  { id: '5', label: 'Immigrate', active: true },
  { id: '6', label: 'Minimalist', active: true },
  { id: '7', label: 'Geometric', active: true },
];

export default function App() {
  const [preferences, setPreferences] = useState<Preference[]>(INITIAL_PREFERENCES);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [genState, setGenState] = useState<GenerationState>({ status: 'idle' });

  // Manage Preferences
  const togglePreference = (id: string) => {
    setPreferences(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const addPreference = (label: string) => {
    const newId = Math.random().toString(36).substr(2, 9);
    setPreferences(prev => [...prev, { id: newId, label, active: true }]);
  };

  const removePreference = (id: string) => {
    setPreferences(prev => prev.filter(p => p.id !== id));
  };

  // Generate Handler
  const handleGenerate = async () => {
    if (!sourceImage) return;

    const activePrefs = preferences.filter(p => p.active).map(p => p.label);
    if (activePrefs.length === 0) {
      setGenState({ status: 'error', message: 'Please select at least one theme.' });
      return;
    }

    setGenState({ status: 'generating' });
    setResultImage(null);

    try {
      const generatedBase64 = await generateTattooDesign({
        image: sourceImage,
        preferences: activePrefs
      });
      setResultImage(generatedBase64);
      setGenState({ status: 'success' });
    } catch (error) {
      setGenState({ status: 'error', message: 'Failed to generate design. Try again.' });
    }
  };

  const handleReset = () => {
    setSourceImage(null);
    setResultImage(null);
    setGenState({ status: 'idle' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-ink-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-skin-500 to-gray-800 flex items-center justify-center">
               <span className="font-serif font-bold text-ink-900 text-lg">I</span>
            </div>
            <h1 className="text-xl font-serif tracking-tight text-white">InkFlow</h1>
          </div>
          <div className="text-xs text-gray-500 hidden sm:block">
            Powered by Gemini
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-serif text-white leading-tight">
                Transform your story<br />
                <span className="text-skin-500 italic">into ink.</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Upload a photo of your hand. Our AI will analyze your scars and contours to design a custom, meaningful minimalist tattoo.
              </p>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center gap-2 text-xs font-mono text-gray-600 uppercase tracking-widest">
              <span className={sourceImage ? 'text-skin-500' : 'text-gray-400'}>01. Upload</span>
              <ChevronRight className="w-3 h-3" />
              <span className={preferences.length > 0 ? 'text-skin-500' : 'text-gray-400'}>02. Meaning</span>
              <ChevronRight className="w-3 h-3" />
              <span className={resultImage ? 'text-skin-500' : 'text-gray-400'}>03. Generate</span>
            </div>

            <PreferenceSelector 
              preferences={preferences} 
              togglePreference={togglePreference}
              addPreference={addPreference}
              removePreference={removePreference}
            />

            {/* Mobile: Upload is shown here if not desktop */}
            <div className="lg:hidden">
              <ImageUpload 
                currentImage={sourceImage}
                onImageSelected={setSourceImage}
                onClear={handleReset}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!sourceImage || genState.status === 'generating'}
              className={`
                w-full py-4 rounded-xl font-medium tracking-wide transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group
                ${!sourceImage 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-skin-500 hover:bg-skin-100 text-ink-900 shadow-[0_0_20px_rgba(197,160,131,0.4)]'}
              `}
            >
              {genState.status === 'generating' ? (
                <>
                  <div className="w-5 h-5 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" />
                  <span>Designing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Design</span>
                </>
              )}
              {sourceImage && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              )}
            </button>

            {genState.status === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertCircle className="w-4 h-4" />
                {genState.message}
              </div>
            )}
          </div>

          {/* Right Column: Visualization */}
          <div className="lg:col-span-7 flex flex-col gap-6">
             {/* Desktop: Upload is shown here */}
             <div className="hidden lg:block">
               {!resultImage && (
                 <ImageUpload 
                   currentImage={sourceImage}
                   onImageSelected={setSourceImage}
                   onClear={handleReset}
                 />
               )}
             </div>

             {/* Result View */}
             {resultImage && (
               <div className="animate-fade-in space-y-6">
                 <div className="relative w-full aspect-[3/4] md:aspect-square rounded-xl overflow-hidden shadow-2xl border border-gray-700 group">
                    <img 
                      src={resultImage} 
                      alt="Generated Tattoo Design" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-xl"></div>
                 </div>
                 
                 <div className="flex gap-4">
                   <button 
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = resultImage;
                        link.download = 'inkflow-design.png';
                        link.click();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-ink-800 hover:bg-ink-500 rounded-lg text-sm font-medium transition-colors"
                   >
                     <Download className="w-4 h-4" />
                     Download High Res
                   </button>
                   <button 
                    onClick={handleReset}
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-700 hover:border-gray-500 rounded-lg text-sm font-medium transition-colors text-gray-400 hover:text-white"
                   >
                     Try New Design
                   </button>
                 </div>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}