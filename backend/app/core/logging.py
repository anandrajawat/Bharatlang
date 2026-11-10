import logging
import sys
import time
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger("bharatlangtech")

class LatencyLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()
        path = request.url.path
        method = request.method
        
        try:
            response = await call_next(request)
            duration_ms = (time.time() - start_time) * 1000
            response.headers["X-Response-Time-Ms"] = f"{duration_ms:.2f}"
            logger.info(f"{method} {path} - {response.status_code} ({duration_ms:.1f}ms)")
            return response
        except Exception as e:
            duration_ms = (time.time() - start_time) * 1000
            logger.error(f"{method} {path} failed: {str(e)} ({duration_ms:.1f}ms)")
            raise

