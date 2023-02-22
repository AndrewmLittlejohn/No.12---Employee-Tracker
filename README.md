# No.12---Employee-Tracker

Challenge 12 was to create an employee tracker.  I first tried to do this using when statements in inquirer.js. This didn't work. I finally found a reference in stackoverflow, listed below in the references, that mentioned 'multipleStatements:' which helped a little but I still wasn't able to get too far. At which point I had to following the assignments readme advice and learn about promises. It was in looking into this that I realized an entire long series of inquirer qurstions using the 'when' object wouldn't work properly. It was then that I moved to a single prompt leading to a series of functions driven by a switch cases.

I don't believe there is functionality that allows for a return to main menu that I could have put in in a feasible amount if time so I used a exit function in conjunction with  setTimeOut to exit the app after the chosen prompt has been brought to its logical conclusion. 



### Notation and references

The following provided important guidance in the making of my application. I do not believe any code was directly pasted into my file as such I don't have any direct citations listed.


https://github.com/SBoudrias/Inquirer.js

https://javascript.info/promise-basics

https://github.com/sidorares/node-mysql2/blob/master/README.md#using-connection-pools

https://stackoverflow.com/questions/23266854/node-mysql-multiple-statements-in-one-query




