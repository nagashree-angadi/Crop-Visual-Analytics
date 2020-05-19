import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask import render_template
import json

app = Flask(__name__)

data = pd.read_csv("./static/Data/PreprocessedData.csv")
continent_data = pd.read_csv("./static/Data/PreprocessedDataContinent.csv")
geodata_file = open('./static/Data/countries-50m.json', )


@app.route("/")
def home():
    return render_template("index.html")

# Sending each country and its total yeild
@app.route('/allcrops-by-country', methods=['POST', 'GET'])
def allcrops_by_country():
    if request.method == 'GET':

        df = data[data.Type == "Yield"][["M49 Code", "Value"]]
        df = df.groupby(["M49 Code"]).sum().reset_index()

        res = []
        for country, value in df.values:
            res.append(
                {
                    "id": country,
                    "value": value
                })

        return jsonify({
            "geodata": countries_geodata,
            "yeild": res
        })

# Sending top 10 crops for given country
@app.route('/top-producers', methods=['POST', 'GET'])
def top_producers():
    if request.method == 'GET':
        country = request.args.get('data', 0)
        print(country)

        df = data[data.Type == "Production"]
        df = df[df["M49 Code"] == int(country)][["Crop", "Value"]]
        df = df.groupby("Crop").sum().reset_index().sort_values("Value", ascending=False)[:11]
       
        res = []
        for crop, value in df.values:
            if crop != "0":
                res.append(
                    {
                        "key": crop,
                        "value": value,
                    })

        return jsonify({
            "country": int(country),
            "chart_data": res
        })

# Produce for particular crop, particular country per year
@app.route('/production-by-year', methods=['POST', 'GET'])
def production_by_year():
    if request.method == 'GET':
        crop = request.args.get('crop', 0)
        country = request.args.get('country', 0)
        df = data[data.Type == "Production"]
        df = df[df["Crop"] == crop]
        df = df[df["M49 Code"] == int(country)][["Year", "Value"]]
        df = df.groupby("Year").sum().reset_index()
        res = []
        for year, value in df.values:
            res.append(
                {
                    "year": year,
                    "value": value
                })

        return jsonify(res)


# Crop by continent
@app.route('/crop-by-continent', methods=['POST', 'GET'])
def crop_by_continent():
    if request.method == 'GET':
        crop = request.args.get('data', 0)
        print(crop)
        df = continent_data[continent_data.Type == "Production"]
        df = df[df.Crop == crop][["Continent", "Value"]]
        df = df.groupby("Continent").sum().reset_index()

        res = []
        for continent, value in df.values:
            res.append(
                {
                    "Continent": continent,
                    "Value": value,
                    "enabled": True
                })
        return jsonify(res)


# Getting crops to fill the drop down
@app.route('/crop-names', methods=['POST', 'GET'])
def countries():
    if request.method == 'GET':
        all_crop_names = data["Crop"].unique()
        res = []
        for crop in all_crop_names:
            res.append(crop)
        ret_data = {'res': res}
        return jsonify(ret_data)


if __name__ == "__main__":

    # Reading the data
    data = pd.read_csv("./static/Data/PreprocessedData.csv")
    continent_data = pd.read_csv("./static/Data/PreprocessedDataContinent.csv")
    geodata_file = open('./static/Data/countries-50m.json',)
    countries_geodata = json.load(geodata_file)
    geodata_file.close()
    app.run(debug=True, port=8009)

