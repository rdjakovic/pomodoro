# Sequence Pomodoro Feature



#### **Feature description - requirements** 

I want to add sequence feature. Sequence contains of: Pomodoro, Short Brake and Long Brake(optional).

User cane enter a sequence which app will remember. User can add several sequences but only one can be active.

There will be a toggle to activate sequence mode. When sequence mode is active and user hit Start button, sequence will start,

which means that will start sequence, first Pomodoro time, then Short Brake time and if defined Long Brake time, all automatically.

After each time is off and audio sound will be played, each type Pomodoro, Short Brake and Long Brake will have their own sound defined.

User will have option in settings to define total sequence time - after this time is off sequence will stop, and sequence end sound will be played.



#### UI changes 



###### Settings screen:

Add subtitle: "Sequences", on the right side add a button: "Add sequence".

User will enter values/times in minutes for Pomodoro, Short Brake and Long Brake(optional if value is 0).

When user clicks on "Add sequence" button a new sequence entry will be added and shown in screen bellow the sequence input fields as
a radio buttons list: #SeqNo, Pomodoro, Short Brake and Long Brake. If there is only one sequence it will be automatically active.

If there are several sequences, user can choose active one, which will be remembered.

Setting: Total sequence time with input



###### Main screen - Pomodoro tab:

Bellow Start button, in next row, active sequence will be shown, and main circle counter will show time
defined in sequence.

Sequence flow goes like this:
Pomodoro time -> Pomodoro end sound -> Short Break time -> Short Break end sound -> Long Break time -> Long Break time end sound.

When sequence total time run off -> sequence end sound played.



