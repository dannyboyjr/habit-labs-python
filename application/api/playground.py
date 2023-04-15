from datetime import datetime
import pytz

utc_datetime_str = "Tue, 11 Apr 2023 05:21:21 GMT"
utc_datetime_format = "%a, %d %b %Y %H:%M:%S %Z"

# Parse the string into a datetime object
utc_datetime = datetime.strptime(utc_datetime_str, utc_datetime_format)

# Set the timezone for the datetime object to UTC
utc_timezone = pytz.timezone("UTC")
utc_datetime = utc_timezone.localize(utc_datetime)

# Convert the datetime object to the desired timezone
denver_timezone = pytz.timezone("America/Denver")
denver_datetime = utc_datetime.astimezone(denver_timezone)

print(denver_datetime)