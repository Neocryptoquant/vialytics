import unittest
import sqlite3
import os
import json
from unittest.mock import MagicMock, patch

from vialytics_api.services.price_service import StaticPriceService
from vialytics_api.services.label_service import LabelService
from vialytics_api.services.analytics import WalletAnalyzer
from vialytics_api.core.database import Database

class TestServices(unittest.TestCase):
    def test_price_service(self):
        service = StaticPriceService()
        self.assertEqual(service.get_price("So11111111111111111111111111111111111111112"), 136.00)
        self.assertEqual(service.get_price("unknown_token"), 0.0)

    def test_label_service(self):
        service = LabelService()
        self.assertEqual(service.get_label("So11111111111111111111111111111111111111112"), "Wrapped SOL")
        self.assertEqual(service.get_label("unknown"), "unkn...nown")

class TestAnalytics(unittest.TestCase):
    @patch('vialytics_api.core.database.get_db_connection')
    def test_analytics_structure(self, mock_get_conn):
        # Mock DB connection and cursor
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_conn.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Mock data
        mock_cursor.fetchall.side_effect = [
            [], # transactions
            []  # token_movements
        ]

        analyzer = WalletAnalyzer(db_path=":memory:")
        results = analyzer.analyze()
        
        self.assertIn("portfolio_overview", results)
        self.assertIn("earnings_spending", results)
        self.assertIn("highlights", results)
        
        # Check defaults for empty DB
        self.assertEqual(results['portfolio_overview']['total_balance_usd'], 0.0)

if __name__ == '__main__':
    unittest.main()
