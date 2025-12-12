import json
import argparse
import sys
from vialytics_api.services.analytics import WalletAnalyzer

def main():
    parser = argparse.ArgumentParser(description="Run Vialytics Personal Analytics")
    parser.add_argument("--db", help="Path to wallet.db", default=None)
    parser.add_argument("--output", help="Output JSON file path", default="analytics_output.json")
    
    args = parser.parse_args()
    
    print("Starting Personal Analytics Engine...")
    try:
        analyzer = WalletAnalyzer(db_path=args.db)
        results = analyzer.analyze()
        
        with open(args.output, "w") as f:
            json.dump(results, f, indent=2)
            
        print(f"Analysis complete! Results saved to {args.output}")
        
    except Exception as e:
        print(f"Error running analytics: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
