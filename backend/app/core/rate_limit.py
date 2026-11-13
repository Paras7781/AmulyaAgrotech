from collections import OrderedDict, deque
from math import ceil
from threading import Lock
from time import monotonic


class SlidingWindowLimiter:
    def __init__(self, limit: int, window_seconds: int, max_clients: int = 10_000):
        self.limit = limit
        self.window_seconds = window_seconds
        self.max_clients = max_clients
        self._requests: OrderedDict[str, deque[float]] = OrderedDict()
        self._lock = Lock()

    def check(self, key: str) -> int | None:
        now = monotonic()
        cutoff = now - self.window_seconds

        with self._lock:
            requests = self._requests.get(key)
            if requests is None:
                if len(self._requests) >= self.max_clients:
                    self._requests.popitem(last=False)
                requests = deque()
                self._requests[key] = requests
            else:
                self._requests.move_to_end(key)

            while requests and requests[0] <= cutoff:
                requests.popleft()

            if len(requests) >= self.limit:
                return max(1, ceil(self.window_seconds - (now - requests[0])))

            requests.append(now)
            return None

    def clear(self) -> None:
        with self._lock:
            self._requests.clear()
