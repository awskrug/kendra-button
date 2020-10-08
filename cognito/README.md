# Cognito userpool Backup & Restore Scenario

> Options
> 
> 1. Backup Userpool
> 2. Restore Userpool
> 3. Backup & Restore Userpool

<br>

You may select one option provided underneath after `--mode` 


1. backup
2. restore
3. backupandrestore 


Please go through following steps to complete the procedure.


<br>

> Default variable needed: 

- `localProfileName`
  - Your local AWS profile name.
    - Could be default or profile name you created
      - Check out `~/.aws/credentials` to find out which profile name you have 
      - If you haven't created multiple profile, it will be **default**



<br>

## 1. Backup Userpool

<br>

> Variables needed to fill out


- `stageName`
  - Json file will be created in this name 
- `backupUserpoolId`
  - Type the Userpool Id you'd like to back up
- `backupFilePrefix`
  - This will be your Json file's prefix

<br>


> Execution command

```bash
$ yarn reset --mode backup
```



<br>
<br>

## 2. Restore Userpool

<br>

> Variables needed to fill out


- `restoreUserpoolId`
  - Type the Userpool Id you'd like to restore
- `backedUpDateFileName`
  - The name of the backup file 
- `tempPassword`
  - Your choice of temporary password

<br>


> Execution command


```bash
$ yarn reset --mode restore
```
<br>
<br>


## 3. Backup & Restore Userpool

<br>

> Variables needed to fill out

- `backupUserpoolId`
  - Type the Userpool Id you'd like to back up
- `restoreUserpoolId`
  - Type the Userpool Id you'd like to restore
- `tempPassword`
  - Your choice of temporary password

<br>

> Execution command


```bash
$ yarn reset --mode backupandrestore
```
<br>