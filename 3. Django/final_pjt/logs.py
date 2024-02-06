import json_log_formatter
from datetime import datetime

class JSONFormatter(json_log_formatter.JSONFormatter):
    def json_record(self, message, extra, record):

        extra.update(
            {
            'message' : message,
            # 'user_id': record.user_id, 
            # 'gender' : record.gender, 
            # 'username': record.username, 
            # 'birth_date' : record.birth_date,
            }
        )
        # if 'username' in extra:
        #     extra['username'] = json.dumps(record.username, ensure_ascii=False)
        if 'time' not in extra:
            extra['time'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f") #.strftime("%Y-%m-%d %H:%M:%S.%f") #
        
        return super().json_record(message, extra, record)
