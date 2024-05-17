import pymysql

from config import DATABASE_SETTINGS
import logging


# Class with information about database
class Database():
    connection: pymysql.connections.Connection


# Initializing the database
def init() -> bool:
    try:
        Database.connection = pymysql.connect(host=DATABASE_SETTINGS['host'], user=DATABASE_SETTINGS['user'], password=DATABASE_SETTINGS['password'], database=DATABASE_SETTINGS['database'], port=DATABASE_SETTINGS['port'])
        logging.info(f"The database is connected for {Database.connection.connect_timeout}ms.")
        return True
    except Exception as ex:
        logging.error(f"Error connecting to database: {ex}")
        return False

# Closing the connection with the database
def close() -> None:
    if Database.connection:
        Database.connection.close()
        logging.info("The database connection is closed.")

# Executing SQL queries
def execute(sql: str, args: tuple = None) -> bool:
    try:
        Database.connection.ping()
        with Database.connection.cursor() as cursor:
            cursor.execute(sql, args)
            Database.connection.commit()
            return True
    except Exception as ex:
        logging.error(f"When executing the SQL query, an error occurred: {ex}")
        return False

# Getting data from the database
def query(sql: str, args: tuple = None) -> list | None:
    try:
        Database.connection.ping()
        with Database.connection.cursor() as cursor:
            cursor.execute(sql, args)
            return cursor.fetchall()
    except Exception as ex:
        logging.error(f"When getting data from the database, an error occurred: {ex}")
        return None
    
# Get one line from the database
def query_single(sql: str, args: tuple = None) -> list | None:
    try:
        Database.connection.ping()
        with Database.connection.cursor() as cursor:
            cursor.execute(sql, args)
            return cursor.fetchone()
    except Exception as ex:
        logging.error(f"When getting data from the database, an error occurred: {ex}")
        return None