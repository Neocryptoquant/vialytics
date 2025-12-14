"""
Tests for Vialytics API services.
No mocks - uses real in-memory SQLite and live API calls where needed.
"""
import unittest
import sqlite3
import os

from vialytics_api.services.price_service import StaticPriceService
from vialytics_api.services.label_service import LabelService


class TestPriceService(unittest.TestCase):
    """Tests for StaticPriceService."""

    def test_known_tokens_have_prices(self):
        service = StaticPriceService()
        self.assertEqual(service.get_price("So11111111111111111111111111111111111111112"), 136.00)
        self.assertGreater(service.get_price("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), 0)

    def test_unknown_token_returns_zero(self):
        service = StaticPriceService()
        self.assertEqual(service.get_price("unknown_token_address"), 0.0)


class TestLabelService(unittest.TestCase):
    """Tests for LabelService."""

    def test_known_addresses_have_labels(self):
        service = LabelService()
        self.assertEqual(service.get_label("So11111111111111111111111111111111111111112"), "Wrapped SOL")
        self.assertEqual(service.get_label("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), "USDC")

    def test_unknown_address_returns_shortened(self):
        service = LabelService()
        label = service.get_label("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM")
        self.assertTrue("..." in label)
        self.assertTrue(label.startswith("9WzD"))

    def test_is_known_platform(self):
        service = LabelService()
        self.assertTrue(service.is_known_platform("JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"))
        self.assertFalse(service.is_known_platform("unknown_address"))


class TestHeliusIntegration(unittest.TestCase):
    """Tests for Helius API integration. Skips if no API key."""

    @classmethod
    def setUpClass(cls):
        cls.has_api_key = bool(os.environ.get("HELIUS_API_KEY"))

    def test_enrichment_returns_normalized_data(self):
        if not self.has_api_key:
            self.skipTest("HELIUS_API_KEY not set")
        
        from vialytics_api.services.helius_client import get_default_client
        client = get_default_client()
        
        # 0xAbim: using a known active wallet for testing
        test_wallet = "2QkJLTKTLYFHS6xir1TEXLSdajM7r1DjF96JogKnRGSR"
        result = client.fetch_enrichment(test_wallet, use_cache=False)
        
        self.assertIn("normalized", result)
        self.assertIn("token_balances", result.get("normalized", {}))
        self.assertIn("top_counterparties", result.get("normalized", {}))


if __name__ == '__main__':
    unittest.main()
