import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Calendar, MapPin, Heart, Star, Lock, Folder } from 'lucide-react';
import { useMemories } from '@/hooks/useMemories';
import { useCategories } from '@/hooks/useCategories';
import { EmotionType } from '@/types';

const memorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  fullStory: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().optional(),
  location: z.string().optional(),
  importance: z.enum(['low', 'medium', 'high', 'critical']),
  privacy: z.enum(['private', 'family', 'friends', 'public']),
  isTimeCapsule: z.boolean().optional(),
  timeCapsuleOpenDate: z.string().optional(),
});

type MemoryFormData = z.infer<typeof memorySchema>;

const EMOTIONS: { type: EmotionType; label: string; color: string }[] = [
  { type: 'happy', label: 'Happy', color: 'bg-yellow-500' },
  { type: 'proud', label: 'Proud', color: 'bg-orange-500' },
  { type: 'grateful', label: 'Grateful', color: 'bg-green-500' },
  { type: 'excited', label: 'Excited', color: 'bg-blue-500' },
  { type: 'sad', label: 'Sad', color: 'bg-blue-700' },
  { type: 'angry', label: 'Angry', color: 'bg-red-600' },
  { type: 'fear', label: 'Fear', color: 'bg-purple-600' },
  { type: 'regret', label: 'Regret', color: 'bg-gray-600' },
  { type: 'hope', label: 'Hope', color: 'bg-teal-500' },
  { type: 'motivated', label: 'Motivated', color: 'bg-indigo-500' },
  { type: 'lonely', label: 'Lonely', color: 'bg-slate-500' },
  { type: 'peaceful', label: 'Peaceful', color: 'bg-cyan-500' },
  { type: 'love', label: 'Love', color: 'bg-pink-500' },
  { type: 'loss', label: 'Loss', color: 'bg-stone-600' },
];

export default function MemoryCapture() {
  const { createMemory } = useMemories();
  const { categoriesQuery } = useCategories();
  const [selectedEmotions, setSelectedEmotions] = useState<{ type: EmotionType; intensity: number }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<MemoryFormData>({
    resolver: zodResolver(memorySchema),
    defaultValues: {
      title: '',
      description: '',
      fullStory: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      location: '',
      importance: 'medium',
      privacy: 'private',
      isTimeCapsule: false,
      timeCapsuleOpenDate: '',
    },
  });

  const isTimeCapsule = watch('isTimeCapsule');

  const toggleEmotion = (type: EmotionType) => {
    setSelectedEmotions((prev) => {
      const exists = prev.find((e) => e.type === type);
      if (exists) {
        return prev.filter((e) => e.type !== type);
      }
      return [...prev, { type, intensity: 5 }];
    });
  };

  const updateEmotionIntensity = (type: EmotionType, intensity: number) => {
    setSelectedEmotions((prev) =>
      prev.map((e) => (e.type === type ? { ...e, intensity } : e))
    );
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const onSubmit = async (data: MemoryFormData) => {
    try {
      await createMemory.mutateAsync({
        title: data.title,
        description: data.description,
        fullStory: data.fullStory || '',
        shortSummary: data.description,
        date: data.date, // Store as string (ISO format from date input)
        time: data.time,
        location: data.location ? { name: data.location } : undefined,
        emotions: selectedEmotions.map((e) => ({
          type: e.type,
          intensity: e.intensity,
          primary: e.intensity === Math.max(...selectedEmotions.map((se) => se.intensity)),
        })),
        people: [],
        media: [],
        tags,
        categories: selectedCategories,
        collections: [],
        isFavorite: false,
        importance: data.importance,
        privacy: data.privacy,
        isTimeCapsule: data.isTimeCapsule || false,
        timeCapsuleOpenDate: data.timeCapsuleOpenDate ? new Date(data.timeCapsuleOpenDate) : undefined,
        isTimeCapsuleOpen: false,
      });

      // Reset form
      setSelectedEmotions([]);
      setTags([]);
      setSelectedCategories([]);
      alert('Memory created successfully!');
      reset();
    } catch (error) {
      console.error('Error creating memory:', error);
      alert('Failed to create memory');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Capture Memory</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Basic Information
          </h2>

          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              {...register('title')}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Give your memory a title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              {...register('description')}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="A short description of this memory"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Full Story</label>
            <textarea
              {...register('fullStory')}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={6}
              placeholder="Tell the full story..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date *
              </label>
              <input
                type="date"
                {...register('date')}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <input
                type="time"
                {...register('time')}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <input
              {...register('location')}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Where did this happen?"
            />
          </div>
        </div>

        {/* Emotions */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Emotions
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {EMOTIONS.map((emotion) => {
              const selected = selectedEmotions.find((e) => e.type === emotion.type);
              return (
                <div
                  key={emotion.type}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleEmotion(emotion.type)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{emotion.label}</span>
                    {selected && <X className="w-4 h-4" />}
                  </div>
                  {selected && (
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={selected.intensity}
                      onChange={(e) => updateEmotionIntensity(emotion.type, parseInt(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Tags</h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-secondary rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Folder className="w-5 h-5 text-primary" />
            Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categoriesQuery.data?.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <div
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Settings
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Importance</label>
              <select
                {...register('importance')}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Privacy
              </label>
              <select
                {...register('privacy')}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="private">Private</option>
                <option value="family">Family</option>
                <option value="friends">Friends</option>
                <option value="public">Public</option>
              </select>
            </div>
          </div>

          {/* Time Capsule Settings */}
          <div className="pt-4 border-t space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register('isTimeCapsule')}
                className="w-5 h-5 rounded focus:ring-2 focus:ring-primary"
              />
              <label className="font-semibold flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Make this a Time Capsule
              </label>
            </div>

            {isTimeCapsule && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Open Date
                </label>
                <input
                  type="date"
                  {...register('timeCapsuleOpenDate')}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This memory will be locked until this date
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={createMemory.isPending}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium"
        >
          {createMemory.isPending ? 'Creating...' : 'Create Memory'}
        </button>
      </form>
    </div>
  );
}
