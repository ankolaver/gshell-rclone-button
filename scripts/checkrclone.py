import subprocess
import os
import re
import configparser
import argparse, sys
import PySimpleGUI as sg
from threading import Thread
import threading
import time
from queue import Queue

program_parser = argparse.ArgumentParser(description="Run Rclone Script");
program_parser.add_argument('--source_remote', metavar='~/Docs', type=str, help="The remote which you are syncing from")
program_parser.add_argument('--destination', metavar='Crypt:', type=str, help="Remote you are syncing to")
args = program_parser.parse_args()

if len(sys.argv)==1:
    program_parser.print_help()
    sys.exit(1)
print(args.source_remote)
print(args.destination)

# parser = configparser.ConfigParser()
# parser.read_file(open(os.path.expanduser('~/.config/rclone/rclone.conf')))

# # Extract only encrypted remotes
# possibleremotes = list(remote for remote in parser.sections() if parser[remote]['type']=="crypt")
# print(possibleremotes)


layout = [  [sg.Text("Syncing Source")],
            [sg.Text(f"Syncing from {args.source_remote} to {args.destination}")],
        ]


def get_dry_run(source, dest):   
    rclone_dryrun = subprocess.getoutput(f'rclone sync {source} {dest} --dry-run')
    # rclone_dryrun = subprocess.Popen(['rclone', 'sync', source, dest, '--dry-run'])

    return rclone_dryrun

que = Queue()

t = Thread(target=lambda q,sr, des: q.put(get_dry_run(sr, des)), 
            args=(que, args.source_remote, args.destination))
t.start()

# create the window
window = sg.Window('Syncing Initialization', layout, finalize=True)

# timeout = 19
# print(t.is_alive())
# while t.is_alive():
#     # window.write_event_value('update_dry_run', 20-timeout)
#     print("true")
#     window, event, values = sg.read()
#     # window['dry_run'].update(values[event])   
#     # print(window, values)
#     # if event.startswith('update_'):
#     time.sleep(2)
#     window['dry_run'].update(20-timeout)
    
    
#     # if 20-timeout < 0:
#     #     window.close()
#     #     sys.exit("Too long to process")
        
#     # window.refresh()
#     timeout -= 1
#     print(timeout)
    

t.join()

stdout = que.get()
transfer_bytes = str(stdout).split("Transferred:  ")[1].split("/")[0].strip()

window.close()

#stdout, stderr = rclone_dryrun.communicate()

# Extract Files which will be overrided on remote
# stdout = rclone_dryrun
li_items = re.findall(r'NOTICE([^"=]+)NOTICE:', str(stdout))
li_items = li_items[0].split("\n")

files_to_delete = []
for item in li_items:
    if "delete" in item:
        files_to_delete.append(item.split(": ")[1])

print(f"files to delete {str(files_to_delete)}")

layout = [  [sg.Text(f"Will start syncing {transfer_bytes} of documents")],
            [sg.Text("Files which will be deleted")],
            [[sg.Text(f"{file}"),] for file in files_to_delete],
            [sg.Button("Yes, delete them")],
            [sg.Button("No, Terminate the program.")]
        ]

window = sg.Window('Files to delete', layout, finalize=True)

while True:
    event, values = window.read()
    # End program 
    if event == "No, Terminate the program." or event == sg.WIN_CLOSED:
        window.close()
        break
    elif event == "Yes, delete them":
        result = subprocess.getoutput(f'rclone sync {args.source_remote} {args.destination} --progress')
        time_taken = str(result).split("Elapsed time:")[1].strip()
        os.system(f"notify-send 'Time to sync: {time_taken}'")
