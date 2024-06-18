from flask import Flask, jsonify, request,make_response,render_template
import os
import pandas as pd
import numpy as np
from pyvis.network import Network
import plotly.express as px
from flask_cors import CORS  # Import the CORS extension
app = Flask(__name__)

CORS(app)  # Enable CORS for your app
CORS(app, resources={r"/*": {"origins": "*"}})

all_filtered_nodes=[]
all_filtered_edges=[]
@app.route("/", methods=["POST"])
def get_data():
    print("Loading data")
    #r"All_Sets_Resume_Data.csv"
    # df = pd.read_csv(r"Skills_Final_Extracted_Skills_updated_6.csv")
    df = pd.read_csv(r"All_Sets_Resume_Data_1.csv",encoding='ISO-8859-1')
    df.drop_duplicates(subset=['name'],keep='last',inplace=True)
    unique_companies1 = df["Company_Latest"].unique().tolist()
    unique_companies2 = df["CompanyO1"].unique().tolist()
    unique_companies3 = df["CompanyO2"].unique().tolist()
    total_companies = unique_companies1 + unique_companies2 + unique_companies3
    # print(total_companies)
    df1 = pd.DataFrame(total_companies, columns=['Company'])
    companies_list = df1['Company'].astype(str).tolist()
    total_companies1 = list(set(companies_list))
    # cleaned_list = [value for value in total_companies1 if not isinstance(value, int) and value not in [None, '']]
    unique_profiles = df['name'].nunique()
    unique_locations = df['cities'].nunique()
    unique_skills = df['final_technologies'].nunique()
    unique_companies = len(total_companies1)
    print('Total Unique Profiles',unique_profiles)
    print('Total Unique Locations',unique_locations)
    print('Total Unique Skills',unique_skills)
    print('Total Companies',len(total_companies1))
    data=request.get_json()
    # print(data)
    technologies = data['skills']
    cities = data['technologies']
    companies = data['company']

    
    if technologies:
  # Create an empty list to store filtered DataFrames
        filtered_dfs = []
        for technology in technologies:
    # Filter for each technology and append the result to the list
            filtered_df = df[df["final_technologies"].str.contains(technology, case=False)]
            filtered_dfs.append(filtered_df)
  
  # Combine all filtered DataFrames using bitwise OR (|)
        df_filtered = pd.concat(filtered_dfs, ignore_index=True)
    else:
  # No technologies provided, keep the entire DataFrame
        df_filtered = df.copy()

 
    if cities:
        filtered_dfs = []
        for city in cities:
            filtered_df = df_filtered[df_filtered["cities"].str.contains(city, case=False)]
            filtered_dfs.append(filtered_df)
  
        df_filtered = pd.concat(filtered_dfs, ignore_index=True)

    
     
    if companies:

        filtered_dfs = []
        for company in companies:
            filtered_df = df_filtered[df_filtered["CompanyO1"].str.contains(company, case=False)]
            filtered_dfs.append(filtered_df)
  
        df_filtered = pd.concat(filtered_dfs, ignore_index=True)
    
    
    df = df_filtered.copy()
    # print(df)

    
    # df=df.replace('not specified', np.nan, inplace=True)
    unique_companies_0 = df["Company_Latest"].unique().tolist()
    unique_companies_1 = df["CompanyO1"].unique().tolist()
    unique_companies_2 = df["CompanyO2"].unique().tolist()
    all_companies = unique_companies_0 + unique_companies_1 + unique_companies_2
 
    dict_movements = df.drop(["name", "cities", "final_technologies"], axis=1).to_dict(
        orient="records"
    )
    # print(dict_movements)
    latest_movement = []
    previous_movement = []
 
    for i in range(len(dict_movements)):
        current_dict = dict_movements[i]
        latest_movement.append(
            tuple([current_dict["CompanyO1"], current_dict["Company_Latest"]])
        )
        previous_movement.append(
            tuple([current_dict["CompanyO2"], current_dict["CompanyO1"]])
        )
 
    latest_movement_df = pd.DataFrame(latest_movement, columns=["from", "to"])
    previous_movement_df = pd.DataFrame(previous_movement, columns=["from", "to"])
    previous_movement_df.replace("not specified", np.nan, inplace=True)
    latest_movement_df.replace("not specified", np.nan, inplace=True)
    latest_movement_df.dropna(inplace=True)
    previous_movement_df.dropna(inplace=True)
    latest_movements_list = list(latest_movement_df.to_records(index=False))
    previous_movements_list = list(previous_movement_df.to_records(index=False))
    # print(latest_movements_list)
    # print(previous_movements_list)
    count_df_latest = pd.DataFrame(
        latest_movement_df["to"].value_counts()
    ).reset_index()
    count_df_previous = pd.DataFrame(
        previous_movement_df["to"].value_counts()
    ).reset_index()
    combined_count_df = pd.merge(
        count_df_latest, count_df_previous, on="to", how="outer"
    )
    combined_count_df.replace(np.nan, 0, inplace=True)
    combined_count_df["total_to"] = (
        combined_count_df["count_x"] + combined_count_df["count_y"]
    )
    # combined_count_df1 = combined_count_df
    combined_df = pd.concat([previous_movement_df,latest_movement_df],axis=0)
    # print(combined_df)
    combined_count_dict = (
        combined_count_df.drop(columns=["count_x", "count_y"])
        .set_index("to")["total_to"]
        .to_dict()
    )
    # print(combined_count_dict)
    # if 'from' in data or 'to' in data:
    # Extract unique values from col1 and col2
    col1_values = combined_df['from'].unique().tolist()
    col2_values = combined_df['to'].unique().tolist()

    from_values = list(set(col1_values))
    to_values = list(set(col2_values))
    combined_list = from_values + to_values
    combined_list1 = list(set(combined_list))
    # print(combined_list1)
    # print(combined_count_dict)
    net = Network(
        notebook=True,
        directed=True,
        filter_menu=False,
        bgcolor="#222222",
        font_color="white",
    )

    for node in all_companies:
        if node != "not specified":
            try:
                net.add_node(
                    node,
                    label=node,
                    label_size=10,
                    title=f"{node}:{combined_count_dict[node]}",
                    color="#EFF396",
                    size=combined_count_dict[node] * 10,
                )
            except:
                net.add_node(
                    node, label=node, label_size=10, title=node, color="#EFF396", size=8
                )
 
    for i in latest_movements_list:
        net.add_edge(
            i[0], i[1], color="#F2613F", physics=False, title=i[0] + " to " + i[1]
        )
    for i in previous_movements_list:
        net.add_edge(
            i[0], i[1], color="White", physics=False, title=i[0] + " to " + i[1]
        )
    # print(net)
    # net.remove_nodes_from([node for node in net.nodes if node not in from_values and node not in to_values])
    # net.show_buttons(filter_=None)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    net.write_html(name='network_graph.html',local=True,notebook=False,open_browser=False)
    # net.show(name='network_graph.html')
    # net.show(
    #     "network_graph.html",
    #     notebook=False,
    # )

    edges = net.get_edges()
    # nodes=net.get_nodes()
    # all_filtered_nodes=nodes.copy()
    all_filtered_edges=edges.copy()
    # print(all_filtered_edges)
    # Convert JSON to DataFrame
    df_json = pd.DataFrame(all_filtered_edges)
    df_json_upd = df_json[['from','to','color','title']]
    response_data = {
        'From': from_values,
        'To': to_values,
        'total_unique_profiles' : unique_profiles,
        'total_unique_locations' : unique_locations,
        'total_unique_skills' : unique_skills,
        'total_unique_companies' : unique_companies
    }

    # Retrieve JSON data from the request
        # Filter based on dropdown selection
    from_value = []
    to_value = []
    new_net = Network(
            notebook=True,
            directed=True,
            filter_menu=False,
            bgcolor="#222222",
            font_color="white",
        )
    if "From" in data or "To" in data:
        from_value = data.get('From')
        to_value = data.get('To')
        if from_value is not None and len(from_value) != 0:
            filtered_df_json = df_json[df_json['from'].isin(from_value)]
            filtered_df_json = filtered_df_json.reset_index(drop=True)
            filtered_df_json1 = filtered_df_json[['from','to','color','title']]
            combined_list1 = list(set(filtered_df_json['from'].tolist() + filtered_df_json['to'].tolist()))
            additional_movements_list = list(filtered_df_json1.to_records(index=False))
            # additional_movements_list = list(filtered_df_json1.to_records(index=False))
        elif to_value is not None and len(to_value) != 0:
            filtered_df_json = df_json[df_json['to'].isin(to_value)]
            filtered_df_json = filtered_df_json.reset_index(drop=True)
            filtered_df_json1 = filtered_df_json[['from','to','color','title']]
            combined_list1 = list(set(filtered_df_json['from'].tolist() + filtered_df_json['to'].tolist()))
            additional_movements_list = list(filtered_df_json1.to_records(index=False))
        # from_to_values = list(set(filtered_df_json['from'].tolist() + filtered_df_json['to'].tolist()))

        for node1 in combined_list1:
            if node1 != "not specified":
                try:
                    new_net.add_node(
                        node1,
                        label=node1,
                        label_size=10,
                        title=f"{node1}:{combined_count_dict[node1]}",
                        color="#EFF396",
                        size=combined_count_dict[node1] * 10,
                    )
                except:
                    new_net.add_node(
                        node1, label=node1, label_size=10, title=node1, color="#EFF396", size=8
                    )
    if from_value is not None and len(from_value) != 0:  # If 'from' value is selected
        for i in additional_movements_list:
            for j in from_value:
                if i[0] == j:
                    new_net.add_edge(i[0], i[1],color=i[2], physics=False, title=i[3])
    
    if to_value is not None and len(to_value) != 0: # If 'from' value is selected
        for i in additional_movements_list:
            for j in to_value:
                if i[1] == j:
                    new_net.add_edge(i[0], i[1],color=i[2], physics=False, title=i[3])
    # new_net.show_buttons(filter_=None)
    new_net.write_html(name='network_graph1.html',local=True,notebook=False)
    # Construct the file paths
    # network_graph_path = os.path.join(current_dir, 'network_graph.html')
    # # Return the HTML files as a response
    # with open(network_graph_path, 'rb') as f:
    #     html_content1 = f.read()
    # network_graph1_path = os.path.join(current_dir, 'network_graph1.html')
    # if os.path.exists(network_graph1_path):
    #     network_graph1_path = os.path.join(current_dir, 'network_graph1.html')
    #     with open(network_graph1_path, 'rb') as f:
    #         html_content2 = f.read()
    # response_data_json = jsonify(response_data)
    # response1 = make_response(html_content1)
    # response1.headers.set('Content-Type', 'text/html')
    # response2 = make_response(html_content2)
    # response2.headers.set('Content-Type', 'text/html')
    
    return jsonify(response_data)

if __name__ == "__main__":
    app.run(debug=True,port=5000)