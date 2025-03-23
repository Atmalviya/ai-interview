import nltk
import ssl

def download_nltk_data():
    try:
        # Create an unverified SSL context to avoid SSL certificate issues
        try:
            _create_unverified_https_context = ssl._create_unverified_context
        except AttributeError:
            pass
        else:
            ssl._create_default_https_context = _create_unverified_https_context

        # Download all required NLTK data
        nltk.download('punkt')
        nltk.download('punkt_tab')
        nltk.download('averaged_perceptron_tagger')
        nltk.download('tokenizers')
        print("NLTK data downloaded successfully!")
    except Exception as e:
        print(f"Error downloading NLTK data: {str(e)}")

if __name__ == "__main__":
    download_nltk_data() 