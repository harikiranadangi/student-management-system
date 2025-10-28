@echo off
setlocal

:: ==========================================
::  RESET + MIGRATE DATABASE (Local → Render)
:: ==========================================

:: --- Database URLs ---
set SRC_DB=postgresql://postgres:Hari%%40123@localhost:5432/schooldb
set DEST_DB=postgresql://kotakschooldb_zvb4_user:FTpwaOmRtSancFVjucs3817STqW82qcJ@dpg-d40393qli9vc73btnoe0-a.oregon-postgres.render.com/kotakschooldb_zvb4

:: --- Optional: Path to PostgreSQL bin folder ---
:: set PATH=%PATH%;"C:\Program Files\PostgreSQL\18\bin"

echo ==========================================
echo   RESETTING & MIGRATING DATABASE
echo ==========================================

:: Step 1: Export local database
echo 🔹 Exporting local database...
pg_dump -Fc "%SRC_DB%" -f temp_schooldb.dump
if %errorlevel% neq 0 (
    echo ❌ Error: pg_dump failed. Aborting.
    exit /b %errorlevel%
)

:: Step 2: Drop all objects from remote database
echo 🔹 Resetting remote database (dropping all tables)...
psql "%DEST_DB%" -c "DO \$\$ DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END \$\$;"
if %errorlevel% neq 0 (
    echo ❌ Error: Could not reset remote database.
    del temp_schooldb.dump
    exit /b %errorlevel%
)

:: Step 3: Restore data to remote Render database
echo 🔹 Migrating new data to Render database...
pg_restore --no-owner --no-privileges -d "%DEST_DB%" temp_schooldb.dump
if %errorlevel% neq 0 (
    echo ❌ Error: pg_restore failed. Aborting.
    del temp_schooldb.dump
    exit /b %errorlevel%
)

:: Step 4: Cleanup
del temp_schooldb.dump

echo ✅ Database successfully reset and migrated to Render!
echo ==========================================

pause
endlocal
