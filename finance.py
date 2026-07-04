import serial
import time
import smtplib
from email.message import EmailMessage

# ── hardcoded sender credentials ──────────────────────────────────────────────

SENDER_EMAIL    = 'camcodetests@gmail.com'
SENDER_PASSWORD = 'twbh vmje ilhy rwfo'

# ── config ────────────────────────────────────────────────────────────────────

SERIAL_PORT      = 'COM3'          # Mac/Linux: '/dev/ttyUSB0'
BAUD_RATE        = 9600
COOLDOWN_SECONDS = 60

# ── helpers ───────────────────────────────────────────────────────────────────

def email_alert(subject, body, to):
    msg = EmailMessage()
    msg.set_content(body)
    msg['subject'] = subject
    msg['to']      = to
    msg['from']    = SENDER_EMAIL

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(SENDER_EMAIL, SENDER_PASSWORD)
    server.send_message(msg)
    server.quit()

# ── monitor loop ──────────────────────────────────────────────────────────────

ser        = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
last_alert = 0

print('Listening to Arduino...')

while True:
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8').strip()
        print(line)

        if 'DETECTED' in line:
            now = time.time()
            if now - last_alert > COOLDOWN_SECONDS:
                try:
                    email_alert(
                        subject = 'Security Alert!',
                        body    = 'Something was detected by your security sensor.',
                        to      = 'itscamg@gmail.com'
                    )
                    print('Email sent!')
                    last_alert = now
                except Exception as e:
                    print(f'Email error: {e}')