import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask import render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

# Sending each country and its total yeild
@app.route('/allcrops-by-country', methods=['POST', 'GET'])
def allcrops_by_country():
    if request.method == 'GET':

        df = data[data.Type == "Yield"].drop(columns=["Country Code", "Crop Code", "Year"])
        df = df.groupby(["Country"]).sum().reset_index()

        res = []
        for country,value in df.values:
            res.append(
            {
                "country" : country,
                "value" : value
            })

        return jsonify(res)

# Sending top 20 producers for given crop
@app.route('/top-producers', methods=['POST', 'GET'])
def top_producers():
    if request.method == 'GET':
        crop = request.args.get('data',0)
        print(crop)

        df = data[data.Type == "Production"]
        df = df[df.Crop == "Wheat"][["Country", "Value"]]
        df = df.groupby("Country").sum().reset_index().sort_values("Value", ascending=False)[:20]

        res = []
        for country,value in df.values:
            res.append(
            {
                "country" : country,
                "value" : value
            })
        
        return jsonify(res)


@app.route('/production-by-year', methods=['POST', 'GET'])
def production_by_year():
    if request.method == 'GET':
        crop = request.args.get('data', 0)
        print(crop)
        data = 0000
        vals = {'chart_data': data}
        return jsonify(vals)


@app.route('/crop-by-continent', methods=['POST', 'GET'])
def crop_by_continent():
    if request.method == 'GET':
        crop = request.args.get('data', 0)
        print(crop)
        data = 0000
        vals = {'chart_data': data}
        return jsonify(vals)

# Getting crops to fill the drop down
@app.route('/crop-names', methods=['POST', 'GET'])
def countries():
    if request.method == 'GET':
        return data["Crop"].unique()


if __name__ == "__main__":

    # Reading the data
    data = pd.read_csv("./static/Data/PreprocessedData.csv")
    app.run(debug=True)


