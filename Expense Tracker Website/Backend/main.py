import requests

from datetime import datetime, timedelta
import os
from flask_cors import *
from flask import *

import json

# import cv2
import itertools
import os
import mysql.connector
app = Flask(__name__)
cros = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/register', methods=['POST'], strict_slashes=False)
def register():

    a = request.json

    mydb = mysql.connector.connect(
        host="localhost", user="root",  password="",  database="expense_tracker")
    mycursor = mydb.cursor()
    try:
        e = "insert into registration(Phone)values('%s')" % (
            a["Ph"])
        mycursor.execute(e)
        mydb.commit()
        e = "select userid from registration where Phone='%s'" % (
            a["Ph"])
        mycursor.execute(e)
        userid = mycursor.fetchall()
        e = "insert into ruser(userid,Name,Password,email)values('%s','%s','%s','%s')" % (userid[0][0],
                                                                                          a["Name"], a["Password"],  a["Email"])
        mycursor.execute(e)
        mydb.commit()

        e = "insert into bank(userid,amount)values('%s',0)" % (userid[0][0])

        mycursor.execute(e)
        mydb.commit()
        e = "insert into cash(userid,amount)values('%s',0)" % (userid[0][0])

        mycursor.execute(e)
        mydb.commit()

        return "account created successfully"
    except:
        return "This Email id or Phone number is already exist"


@app.route('/add_user', methods=['POST'], strict_slashes=False)
def add_user():
    a = request.json

    mydb = mysql.connector.connect(
        host="localhost", user="root",  password="",  database="expense_tracker")
    mycursor = mydb.cursor()
    try:

        e = "insert into ruser(userid,Name,Password,email)values('%s','%s','%s','%s')" % (a["userid"],
                                                                                          a["Name"], a["Password"],  a["Email"])
        mycursor.execute(e)
        mydb.commit()

        return "User created successfully"
    except:
        return "This Email id is already exist"


@app.route('/Check', methods=['POST'], strict_slashes=False)
def check():
    a = request.json

    mydb = mysql.connector.connect(
        host="localhost", user="root",  password="",  database="expense_tracker")
    mycursor = mydb.cursor()
    e = "select userid,Name from ruser  where email='%s' and Password='%s'" % (
        a["Name"], a["Password"])
    mycursor.execute(e)

    v2 = mycursor.fetchall()
    if v2 == []:
        return "No user found"
    v = {"id": v2[0][0], "name": v2[0][1]}
    return v


@app.route('/getbalnce', methods=['POST'], strict_slashes=False)
def getbalance():
    a = request.json
    print(a)
    mydb = mysql.connector.connect(
        host="localhost", user="root",  password="",  database="expense_tracker")
    mycursor = mydb.cursor()
    e = '''SELECT (select amount from cash where userid='%s'  ) as cash,(select amount from bank where userid='%s') as bank,
(select amount from cash where userid='%s') +(select amount from bank where userid='%s') as total''' % (
        a["userid"], a["userid"], a["userid"], a["userid"])

    mycursor.execute(e)

    v2 = mycursor.fetchall()

    v = {"bal": v2[0][2], "cash": v2[0][0], "bank": v2[0][1]}
    return (v)


@app.route('/suggestion', methods=['POST'], strict_slashes=False)
def suggestion():
    mydb = mysql.connector.connect(
        host="localhost", user="root",  password="",  database="expense_tracker")
    mycursor = mydb.cursor()
    e = "select purpose from purpose"
    mycursor.execute(e)
    v1 = mycursor.fetchall()
    e = "select where_invest from where_invest"
    mycursor.execute(e)
    v2 = mycursor.fetchall()
    v = {"sugges": v1, "inve": v2}
    print(v)
    return (v)


@app.route('/store_data', methods=['POST'], strict_slashes=False)
def store_data():
    a = request.json
    print(a)
    mydb = mysql.connector.connect(
        host="localhost", user="root",  password="",  database="expense_tracker")
    mycursor = mydb.cursor()
    e = "select * from purpose where purpose='%s'" % (a['toinex'])
    mycursor.execute(e)
    v2 = mycursor.fetchall()
    if v2 == []:
        e = "insert into purpose(purpose)values('%s')" % (a['toinex'])
        mycursor.execute(e)
        mydb.commit()

    e = '''SELECT (select amount from cash where userid='%s'  ) as cash,(select amount from bank where userid='%s') as bank,
(select amount from cash where userid='%s') +(select amount from bank where userid='%s') as total''' % (
        a["userid"], a["userid"], a["userid"], a["userid"])

    mycursor.execute(e)

    v2 = mycursor.fetchall()

    bal = v2[0][2]
    cash = v2[0][0]
    bank = v2[0][1]

    if a["type"] == "expense":
        if a['bank_cash'] == "cash":
            if cash >= int(a['amount']):

                e = "update cash set amount=amount-'%s' where userid='%s'" % (
                    a['amount'], a['userid'])

                mycursor.execute(e)
                mydb.commit()

            else:
                return ("not enough amount available for expense")
        elif a['bank_cash'] == "bank":
            if bank >= int(a['amount']):

                e = "update bank set amount=amount-'%s' where userid='%s'" % (
                    a['amount'], a['userid'])
                mycursor.execute(e)
                mydb.commit()

            else:
                return ("not enough amount available for expense")
    else:
        if a['bank_cash'] == "cash":

            e = "update cash set amount=amount+'%s' where userid='%s'" % (
                a['amount'], a['userid'])
            mycursor.execute(e)
            mydb.commit()

        else:

            e = "update bank set amount=amount+'%s' where userid='%s'" % (
                a['amount'], a['userid'])
            mycursor.execute(e)
            mydb.commit()
    e = "insert into inex(userid,	category,amount,purpose,amount_type,Name)values('%s','%s','%s','%s','%s','%s')" % (
        a["userid"], a["type"], a['amount'], a['toinex'], a['bank_cash'], a['Name'])
    mycursor.execute(e)
    mydb.commit()

    return ("Updated")


@app.route('/get_data', methods=['POST'], strict_slashes=False)
def getdata():
    a = request.json
    print("hello")
    mydb = mysql.connector.connect(
        host="localhost", user="root",  password="",  database="expense_tracker")
    mycursor = mydb.cursor()
    if a["month"] == '':
        e = "select date,purpose,amount,amount_type,category ,id,Name,datetime from inex  where userid='%s' order by  id   desc " % (
            a["userid"])
        mycursor.execute(e)

        v2 = mycursor.fetchall()
        e = "select sum(amount) from inex  where userid='%s'  and category='expense' order by date desc  " % (
            a["userid"])

        mycursor.execute(e)

        v0 = mycursor.fetchall()

        e = "select sum(amount) from inex  where userid='%s'  and category='income' order by date desc  " % (
            a["userid"])
        mycursor.execute(e)

        v1 = mycursor.fetchall()
        if v0[0][0] != None:
            s0 = int(v0[0][0])
        else:
            s0 = 0
        if v1[0][0] != None:
            s1 = int(v1[0][0])
        else:
            s1 = 0
        bal = s1-s0
        v = {"data": v2, "expense": s0, "income": s1, "bal": bal}
        return v
    elif a["month"] == 'current':

        e = "select date,purpose,amount,amount_type,category,id,Name,datetime from inex  where userid='%s' and  MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE()) order by date desc  " % (
            a["userid"])

        mycursor.execute(e)

        v2 = mycursor.fetchall()

        e = "select sum(amount) from inex  where userid='%s'and  MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())  and category='expense' order by date desc  " % (
            a["userid"])
        mycursor.execute(e)

        v0 = mycursor.fetchall()

        e = "select sum(amount) from inex  where userid='%s' and  MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE()) and category='income' order by date desc  " % (
            a["userid"])
        mycursor.execute(e)

        v1 = mycursor.fetchall()
        if v0[0][0] != None:
            s0 = int(v0[0][0])
        else:
            s0 = 0
        if v1[0][0] != None:
            s1 = int(v1[0][0])
        else:
            s1 = 0
        bal = s1-s0
        v = {"data": v2, "expense": s0, "income": s1, "bal": bal}
        return v
    elif a["month"] == 'last':
        e = "select date,purpose,amount,amount_type,category,id,Name,datetime from inex  where userid='%s' and  MONTH(date) =  MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) order by date desc" % (
            a["userid"])

        mycursor.execute(e)

        v2 = mycursor.fetchall()
        if v2 != []:
            e = "select sum(amount) from inex  where userid='%s'and  MONTH(date) =  MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))  and category='expense' order by date desc  " % (
                a["userid"])
            mycursor.execute(e)

            v0 = mycursor.fetchall()

            e = "select sum(amount) from inex  where userid='%s' and   MONTH(date) =  MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) and category='income' order by date desc  " % (
                a["userid"])
            mycursor.execute(e)

            v1 = mycursor.fetchall()
            if v0[0][0] != None:
                s0 = int(v0[0][0])
            else:
                s0 = 0
            if v1[0][0] != None:
                s1 = int(v1[0][0])
            else:
                s1 = 0
            bal = s1-s0
            v = {"data": v2, "expense": s0, "income": s1, "bal": bal}
            return v

        v = {"data": [], "expense": 0, "income": 0, "bal": 0}
        return v
    elif a["month"] == '' and a["category"] != '':

        e = "select date,purpose,amount,amount_type,category,id,Name,datetime from inex  where userid='%s' and category='%s' order by date desc  " % (
            a["userid"], a["category"])
        mycursor.execute(e)

        v2 = mycursor.fetchall()
        if v2 != []:
            e = "select sum(amount) from inex  where userid='%s' and category='expense' order by date desc  " % (
                a["userid"])
            mycursor.execute(e)

            v0 = mycursor.fetchall()

            e = "select sum(amount) from inex  where userid='%s'  and category='income' order by date desc  " % (
                a["userid"])
            mycursor.execute(e)

            v1 = mycursor.fetchall()
            if v0[0][0] != None:
                s0 = int(v0[0][0])
            else:
                s0 = 0
            if v1[0][0] != None:
                s1 = int(v1[0][0])
            else:
                s1 = 0
            bal = s1-s0
            v = {"data": v2, "expense": s0, "income": s1, "bal": bal}
            return v

        v = {"data": [], "expense": 0, "income": 0, "bal": 0}
        return v


@app.route('/delete', methods=['POST'], strict_slashes=False)
def delete():
    a = request.json
    mydb = mysql.connector.connect(
        host="localhost", user="root",  password="",  database="expense_tracker")
    mycursor = mydb.cursor()
    e = '''SELECT (select amount from cash where userid='%s'  ) as cash,(select amount from bank where userid='%s') as bank,
(select amount from cash where userid='%s') +(select amount from bank where userid='%s') as total''' % (
        a["userid"], a["userid"], a["userid"], a["userid"])

    mycursor.execute(e)

    v2 = mycursor.fetchall()

    bal = v2[0][2]
    cash = v2[0][0]
    bank = v2[0][1]

    if a['type'] == "expense" or a['type'] == "investment":
        if a['c_b'] == "cash":
            e = "update cash set amount=amount+'%s' where userid='%s'" % (
                a["amount"], a['userid'])
            mycursor.execute(e)
            mydb.commit()
        else:
            e = "update bank set amount=amount+'%s'  where userid='%s'" % (
                a["amount"], a['userid'])
            mycursor.execute(e)
            mydb.commit()
    elif a['type'] == "income":
        if a['c_b'] == "cash":
            if cash >= int(a['amount']):
                e = "update cash set amount=amount-'%s'  where userid='%s'" % (
                    a["amount"], a['userid'])
                mycursor.execute(e)
                mydb.commit()
            else:
                return "you used your money"
        else:
            if bank >= int(a['amount']):
                e = "update bank set amount=amount-'%s'  where userid='%s'" % (
                    a["amount"], a['userid'])
                mycursor.execute(e)
                mydb.commit()
            else:
                return "you used your money"

    e = "delete from inex where datetime='%s' and userid='%s' " % (
        a['id'], a['userid'])
    mycursor.execute(e)
    mydb.commit()
    e = "delete from invest where datetime='%s' and userid='%s'" % (
        a['id'], a['userid'])
    mycursor.execute(e)
    mydb.commit()
    e = "delete from invest_data where datetime='%s' and userid='%s'" % (
        a['id'], a['userid'])
    mycursor.execute(e)
    mydb.commit()

    return ("deleted")


@app.route('/move', methods=['POST'], strict_slashes=False)
def move():
    a = request.json
    print(a)
    mydb = mysql.connector.connect(
        host="localhost", user="root",  password="",  database="expense_tracker")
    mycursor = mydb.cursor()
    e = '''SELECT (select amount from cash where userid='%s'  ) as cash,(select amount from bank where userid='%s') as bank,
(select amount from cash where userid='%s') +(select amount from bank where userid='%s') as total''' % (
        a["userid"], a["userid"], a["userid"], a["userid"])
    print(e)
    mycursor.execute(e)

    v2 = mycursor.fetchall()

    bal = v2[0][2]
    cash = v2[0][0]
    bank = v2[0][1]
    print(bal, cash, bank, a['amount'], a['userid'])
    if a["bank_cash"] == "bank" and bank >= int(a["amount"]):

        e = "update cash set amount=amount+'%s' where userid='%s'" % (
            a["amount"], a['userid'])
        mycursor.execute(e)
        mydb.commit()
        e = "update bank set amount=amount-'%s' where userid='%s'" % (
            a["amount"], a['userid'])
        mycursor.execute(e)
        mydb.commit()
        return ("updated")
    elif a["bank_cash"] == "cash" and cash >= int(a["amount"]):

        e = "update cash set amount=amount-'%s' where userid='%s'" % (
            a["amount"], a['userid'])
        mycursor.execute(e)
        mydb.commit()
        e = "update bank set amount=amount+'%s' where userid='%s'" % (
            a["amount"], a['userid'])
        mycursor.execute(e)
        mydb.commit()
        return ("updated")
    return "not enough amount available for move"


@app.route('/investment', methods=['POST'], strict_slashes=False)
def investment():
    a = request.json
    mydb = mysql.connector.connect(
        host="localhost", user="root",  password="",  database="expense_tracker")
    mycursor = mydb.cursor()
    e = "select * from where_invest where where_invest='%s'" % (a['wi'])
    mycursor.execute(e)
    v2 = mycursor.fetchall()
    if v2 == []:
        e = "insert into where_invest(where_invest)values('%s')" % (
            a['wi'])
        mycursor.execute(e)
        mydb.commit()
    e = '''SELECT (select amount from cash where userid='%s'  ) as cash,(select amount from bank where userid='%s') as bank,
(select amount from cash where userid='%s') +(select amount from bank where userid='%s') as total''' % (
        a["userid"], a["userid"], a["userid"], a["userid"])
    print(e)
    mycursor.execute(e)

    v2 = mycursor.fetchall()

    bal = v2[0][2]
    cash = v2[0][0]
    bank = v2[0][1]
    if a['bank_cash'] == "cash":
        if cash >= int(a['amount']):

            e = "update cash set amount=amount-'%s' where userid='%s'" % (
                a['amount'], a['userid'])

            mycursor.execute(e)
            mydb.commit()

        else:
            return ("not enough amount available for expense")
    elif a['bank_cash'] == "bank":
        if bank >= int(a['amount']):

            e = "update bank set amount=amount-'%s' where userid='%s'" % (
                a['amount'], a['userid'])
            mycursor.execute(e)
            mydb.commit()

        else:
            return ("not enough amount available for investment")
    e = "select * from invest where userid='%s' and where_invest='%s'" % (
        a['userid'], a['wi'])
    print(e)
    mycursor.execute(e)
    v = mycursor.fetchall()
    print(v)
    if v == []:
        e = "insert into invest (userid,amount,where_invest)values('%s','%s','%s')" % (
            a['userid'], a['amount'], a['wi'])
        mycursor.execute(e)
        mydb.commit()
    else:
        e = "update invest set amount =amount+'%s' where userid='%s'and where_invest='%s'" % (
            a['amount'],  a['userid'], a['wi'])
        print(e)
        mycursor.execute(e)
        mydb.commit()
    e = "insert into invest_data (userid , amount,where_invest,Name,amount_type)value('%s','%s','%s','%s','%s')" % (
        a['userid'], a['amount'], a['wi'], a['Name'], a['bank_cash'])
    print(e)
    mycursor.execute(e)
    mydb.commit()
    e = "insert into inex(userid,category,amount,purpose,amount_type,Name)values('%s','%s','%s','%s','%s','%s')" % (
        a["userid"], "investment", a['amount'], a['wi'], a['bank_cash'], a['Name'])
    mycursor.execute(e)
    mydb.commit()
    return "updated"


@app.route('/gettotal_invest', methods=['POST'], strict_slashes=False)
def gettotal_invest():
    a = request.json
    mydb = mysql.connector.connect(
        host="localhost", user="root",  password="",  database="expense_tracker")
    mycursor = mydb.cursor()
    e = "select sum(amount) from invest where userid='%s' " % (a["userid"])
    mycursor.execute(e)
    v = mycursor.fetchall()
    e = "select *  from invest where userid='%s' " % (a["userid"])
    mycursor.execute(e)
    v2 = mycursor.fetchall()
    print(v)
    v = {"total": v[0][0], "data": v2}
    print(v)
    return (v)


@app.route('/about', methods=['POST'], strict_slashes=False)
def about():
    a = request.json
    mydb = mysql.connector.connect(
        host="localhost", user="root",  password="",  database="expense_tracker")
    mycursor = mydb.cursor()

    e = "select *  from invest_data where userid='%s' and where_invest='%s' " % (
        a["userid"], a["wi"])
    mycursor.execute(e)
    v2 = mycursor.fetchall()

    return json.dumps(v2)


if __name__ == "__main__":
    app.run('0.0.0.0', debug=True)
