from flask import Flask, request, jsonify
from flask import render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route('/allcrops-by-country', methods=['POST', 'GET'])
def allcrops_by_country():
    if request.method == 'GET':
        data = 0000
        vals = {'chart_data': data}
        return jsonify(vals)


@app.route('/top-producers', methods=['POST', 'GET'])
def top_producers():
    if request.method == 'GET':
        crop = request.args.get('data',0)
        print(crop)
        data = 0000
        vals = {'chart_data': data}
        return jsonify(vals)


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


if __name__ == "__main__":
    app.run(debug=True)


