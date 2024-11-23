import React, { useState } from 'react';
import axios from 'axios';

// Define TypeScript interfaces
interface NutrientData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface ApiError {
  error: string;
  content?: string;
}

interface NutritionFormProps {
  apiBaseUrl: string;
  onSuccess?: (data: NutrientData) => void;
  onError?: (error: ApiError) => void;
}

const NutritionForm: React.FC<NutritionFormProps> = ({ 
  apiBaseUrl,
  onSuccess,
  onError 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<NutrientData | null>(null);
  const [activeTab, setActiveTab] = useState<'meal' | 'food'>('meal');
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = activeTab === 'meal' 
        ? '/generate_meal'
        : '/get_nutrients';

      const payload = activeTab === 'meal'
        ? { prompt: input }
        : { food_item: input };

      const response = await axios.post<NutrientData>(
        `${apiBaseUrl}${endpoint}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setData(response.data);
      onSuccess?.(response.data);
    } catch (err) {
      const apiError: ApiError = {
        error: axios.isAxiosError(err) 
          ? err.response?.data?.error || err.message
          : 'An unexpected error occurred',
        content: axios.isAxiosError(err) 
          ? err.response?.data?.content 
          : undefined
      };
      
      setError(apiError);
      onError?.(apiError);
    } finally {
      setLoading(false);
    }
  };

  const renderNutrientData = (data: NutrientData) => (
    <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <span className="font-semibold">Calories:</span>
        <span className="ml-2">{data.calories}</span>
      </div>
      <div>
        <span className="font-semibold">Protein:</span>
        <span className="ml-2">{data.protein}g</span>
      </div>
      <div>
        <span className="font-semibold">Carbs:</span>
        <span className="ml-2">{data.carbs}g</span>
      </div>
      <div>
        <span className="font-semibold">Fats:</span>
        <span className="ml-2">{data.fats}g</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('food')}
          className={`px-4 py-2 rounded ${
            activeTab === 'food' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200'
          }`}
        >
          Get Nutrients
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {activeTab === 'meal' 
              ? 'Describe the meal you want' 
              : 'Enter food item'}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              activeTab === 'meal'
                ? 'e.g., vegetarian breakfast'
                : 'e.g., banana'
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error.error}
          {error.content && (
            <div className="mt-2 text-sm">
              Details: {error.content}
            </div>
          )}
        </div>
      )}

      {data && renderNutrientData(data)}
    </div>
  );
};

// Example usage
const App: React.FC = () => {
  const handleSuccess = (data: NutrientData) => {
    console.log('Success:', data);
  };

  const handleError = (error: ApiError) => {
    console.error('Error:', error);
  };

  return (
    <NutritionForm
      apiBaseUrl="http://localhost:5000"
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
};

export default App;