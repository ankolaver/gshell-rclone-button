import PySimpleGUI as sg
import subprocess
from queue import Queue
from threading import Thread
import time

# layout = [[sg.Text("Hello from PySimpleGUI")], 
#             [sg.ProgressBar(max_value=20, orientation='h', size=(20,20), key='dry_run')],
#             ]

# # Create the window
# window = sg.Window("Demo", layout)


# def get_dry_run(time):   
#     # rclone_dryrun = subprocess.getoutput(f'rclone sync {source} {dest} --dry-run')
#     rclone_dryrun = subprocess.Popen(['sleep', time])

#     return rclone_dryrun

# que = Queue()

# t = Thread(target=lambda q,time: q.put(get_dry_run(time)), 
#             args=(que, '5'))
# t.start()
# count = 5

# # Create an event loop
# while True:
#     event, values = window.read()
#     # End program if user closes window or
#     # presses the OK button
#     window['dry_run'].update(count)
#     window.refresh()
#     time.sleep(2)
#     count -= 1
#     # if event == "OK" or event == sg.WIN_CLOSED:
#     #     break
    
#     if count < 0:
#         break

# window.close()
# t.join()

# stdout = que.get()
# print(stdout)
def test():
    import threading
    layout = [[sg.Text('Testing progress bar:')],
              [sg.ProgressBar(max_value=10, orientation='h', size=(20, 20), key='progress_1')]]

    main_window = sg.Window('Test', layout, finalize=True)
    current_value = 1
    main_window['progress_1'].update(current_value)

    threading.Thread(target=another_function,
                     args=(main_window, ),
                     daemon=True).start()

    while True:
        window, event, values = sg.read_all_windows()
        if event == 'Exit':
            break
        if event.startswith('update_'):
            print(f'event: {event}, value: {values[event]}')
            key_to_update = event[len('update_'):]
            window[key_to_update].update(values[event])
            window.refresh()
            continue
        # process any other events ...
    window.close()

def another_function(window):
    import time
    import random
    for i in range(10):
        time.sleep(1)
        current_value = i
        window.write_event_value('update_progress_1', current_value)
    time.sleep(2)
    window.write_event_value('Exit', '')

test()