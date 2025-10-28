@echo off
setlocal

REM === Connection strings ===
set LOCAL_DB=postgresql://postgres:Hari%%40123@localhost:5432/schooldb
set REMOTE_DB=postgresql://kotakschooldb_zvb4_user:FTpwaOmRtSancFVjucs3817STqW82qcJ@dpg-d40393qli9vc73btnoe0-a.oregon-postgres.render.com/kotakschooldb_zvb4

REM === Optional: Add PostgreSQL bin folder to PATH if not already (adjust version/path) ===
REM set PATH=C:\Program Files\PostgreSQL\18\bin;%PATH%

echo ⚠️ Dropping all tables from Render DB...
psql "%REMOTE_DB%" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

echo 📤 Dumping local database (ignoring owners & privileges)...
pg_dump --no-owner --no-privileges "%LOCAL_DB%" > dump.sql

echo 📥 Restoring into Render database...
psql "%REMOTE_DB%" < dump.sql

echo ✅ Migration completed successfully!

endlocal
pause
