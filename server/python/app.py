import os
import json
import re
from flask import Flask, request, jsonify
import openai
from flask_cors import CORS  # Import CORS

# Set up Sambanova client
client = openai.OpenAI(
    api_key="fa12d4dc-72a1-4b8c-a5e4-b04426e87bab",  # Replace with a secure method to load keys
    base_url="https://api.sambanova.ai/v1",
)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def clean_and_parse_json(response_content):
    """
    Cleans and parses the JSON response, removing unwanted units like 'g'.
    """
    try:
        # Remove Markdown formatting
        cleaned_content = response_content.replace("```json", "").replace("```", "").strip()

        # Extract the JSON object using regex
        json_match = re.search(r'(\{.*\})', cleaned_content, re.DOTALL)
        if not json_match:
            raise ValueError("No valid JSON found in the response")

        # Get the JSON string
        json_content = json_match.group(1)

        # Remove units from numeric values (e.g., "34g" -> 34)
        json_content = re.sub(r'(\d+)(g|ml|kg|mg)', r'\1', json_content)

        # Parse the JSON
        return json.loads(json_content)
    except Exception as e:
        raise ValueError(f"Invalid JSON format after cleaning: {e}")

@app.route('/generate_meal', methods=['POST'])
def generate_meal():
    try:
        # Set the default user prompt
        data = request.json
        user_prompt = data.get('prompt')

        if not user_prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Create the chat completion request
        response = client.chat.completions.create(
            model='Meta-Llama-3.1-8B-Instruct',
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Suggest a healthy {user_prompt} and provide only the nutritional information as a JSON object with keys: 'calories', 'protein', 'total carbohydrates', 'total fats','cholestrol','sodium' and 'potassium'. It also including recipes, tips, or any extra information."}
            ],
            temperature=0.1,
            top_p=0.1
        )

        # Extract the response content
        response_content = response.choices[0].message.content.strip()
        app.logger.debug(f"Raw response content: {response_content}")

        # Clean and parse the JSON response
        nutrient_data = clean_and_parse_json(response_content)

        return jsonify(nutrient_data)

    except ValueError as e:
        # Handle JSON parsing errors
        app.logger.error(f"JSON Parsing Error: {e}")
        return jsonify({"error": "Unexpected response format", "content": str(e)}), 400

    except Exception as e:
        # Handle other errors
        app.logger.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/get_nutrients', methods=['POST'])
def get_nutrients():
    try:
        # Extract the food item from the request
        data = request.json
        food_item = data.get('food_item')

        if not food_item:
            return jsonify({"error": "Food item is required"}), 400

        # Create the chat completion request
        response = client.chat.completions.create(
            model='Meta-Llama-3.1-8B-Instruct',
            messages=[
                {"role": "system", "content": "You are a knowledgeable nutrition assistant."},
                {"role": "user", "content": f"Provide the nutritional information for 100grams of {food_item} as a JSON object with keys: 'calories', 'protein', 'total carbohydrates', 'total fats','cholestrol','sodium' and 'potassium'."}
            ],
            temperature=0.1,
            top_p=0.1
        )

        # Extract the response content
        response_content = response.choices[0].message.content.strip()
        app.logger.debug(f"Raw response content for {food_item}: {response_content}")

        # Clean and parse the JSON response
        nutrient_data = clean_and_parse_json(response_content)

        return jsonify(nutrient_data)

    except ValueError as e:
        # Handle JSON parsing errors
        app.logger.error(f"JSON Parsing Error: {e}")
        return jsonify({"error": "Unexpected response format", "content": str(e)}), 400

    except Exception as e:
        # Handle other errors
        app.logger.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Use production-safe settings
    app.run(debug=False, host='0.0.0.0', port=5000)
