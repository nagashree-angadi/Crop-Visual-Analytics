import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask import render_template
from sklearn.preprocessing import StandardScaler
from sklearn import preprocessing
from sklearn.decomposition import PCA
import json

app = Flask(__name__)

data = pd.read_csv("./static/Data/PreprocessedData.csv")
continent_data = pd.read_csv("./static/Data/PreprocessedDataContinent.csv")
geodata_file = open('./static/Data/countries-50m.json', )
soil_data = pd.read_csv("./static/Data/Soil_Microbial_Biomass_C_N_P_spatial.csv", encoding = "ISO-8859-1")



for col in soil_data.columns:
    if soil_data[col].dtype != 'object':
        soil_data[col] = soil_data[col].fillna(soil_data[col].median())
    else:
        encoder = preprocessing.LabelEncoder()
        encoder.fit(list(soil_data[col].values))
        soil_data[col] = encoder.transform(list(soil_data[col].values))


def find_cumulative(values):
    num = 0
    output = []
    for val in values:
        num += val
        output.append(num)
    return output


def find_intrinsic_dimensions(df):
    x = df
    x = StandardScaler().fit_transform(x)
    pca = PCA()
    pca.fit_transform(x)
    eigenvalues = pca.explained_variance_
    eigenvalues = sorted(eigenvalues, reverse=True)
    cumulative = find_cumulative(eigenvalues)
    result_frame = pd.DataFrame()
    result_frame['key'] = list(range(1, len(eigenvalues)+1))
    result_frame['value'] = eigenvalues
    result_frame['cumulative'] = cumulative
    return result_frame



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

# Sending top 10 producers for given crop
@app.route('/top-producers', methods=['POST', 'GET'])
def top_producers():
    if request.method == 'GET':
        crop = request.args.get('data', 0)
        print(crop)

        df = data[data.Type == "Production"]
        df = df[df.Crop == crop][["Country", "Value"]]
        df = df.groupby("Country").sum().reset_index(
        ).sort_values("Value", ascending=False)[:10]

        res = []
        for country, value in df.values:
            res.append(
                {
                    "Country": country,
                    "Value": value
                })

        return jsonify(res)

# Produce for particular crop per year
@app.route('/production-by-year', methods=['POST', 'GET'])
def production_by_year():
    if request.method == 'GET':
        country = request.args.get('data', 0)
        print("*********"+country)
        df = data[data.Type == "Production"]
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

@app.route('/soil_data_screeplot', methods=['POST', 'GET'])
def soil_data_analysis():
    if request.method == 'GET':
        resp_data = find_intrinsic_dimensions(soil_data)
        chart_data = resp_data.to_dict(orient='records')
        chart_data = json.dumps(chart_data, indent=2)
        vals = {'chart_data': chart_data}
        return jsonify(vals)


if __name__ == "__main__":

    # Reading the data
    data = pd.read_csv("./static/Data/PreprocessedData.csv")
    continent_data = pd.read_csv("./static/Data/PreprocessedDataContinent.csv")
    geodata_file = open('./static/Data/countries-50m.json',)
    countries_geodata = json.load(geodata_file)
    geodata_file.close()
    app.run(debug=True, port=8009)

