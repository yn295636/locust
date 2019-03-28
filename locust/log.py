import logging
import socket
import sys

host = socket.gethostname()


def setup_logging(loglevel, logfile):
    numeric_level = getattr(logging, loglevel.upper(), None)
    if numeric_level is None:
        raise ValueError("Invalid log level: %s" % loglevel)

    log_format = "[%(asctime)s] {0}/%(levelname)s/%(name)s: %(message)s".format(host)
    formatter = logging.Formatter(fmt=log_format)
    handlers = []
    if logfile is not None:
        file_handler = logging.FileHandler(logfile)
        file_handler.setFormatter(formatter)
        handlers.append(file_handler)
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    handlers.append(stream_handler)
    logging.basicConfig(level=numeric_level, handlers=handlers)

    sys.stderr = StdErrWrapper()
    sys.stdout = StdOutWrapper()


stdout_logger = logging.getLogger("stdout")
stderr_logger = logging.getLogger("stderr")


class StdOutWrapper(object):
    """
    Wrapper for stdout
    """

    def write(self, s):
        stdout_logger.info(s.strip())

    def flush(self, *args, **kwargs):
        """No-op for wrapper"""
        pass


class StdErrWrapper(object):
    """
    Wrapper for stderr
    """

    def write(self, s):
        stderr_logger.error(s.strip())

    def flush(self, *args, **kwargs):
        """No-op for wrapper"""
        pass


# set up logger for the statistics tables
console_logger = logging.getLogger("console_logger")
# create console handler
sh = logging.StreamHandler()
sh.setLevel(logging.INFO)
# formatter that doesn't include anything but the message
sh.setFormatter(logging.Formatter('%(message)s'))
console_logger.addHandler(sh)
console_logger.propagate = False

# configure python-requests log level
requests_log = logging.getLogger("requests")
requests_log.setLevel(logging.WARNING)
