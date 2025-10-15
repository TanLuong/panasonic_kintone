import pandas as pd
import numpy as np
from datetime import datetime


def financial_year(date: str):
    date_obj = datetime.strptime(date, "%m/%d/%Y")
    month = date_obj.month
    year = date_obj.year
    if month > 3:
        return f'FY{year}'
    return f'FY{year - 1}'

csv_file = 'data/RHQ.csv'

df = pd.read_csv(csv_file, encoding='utf-8', delimiter='\t')


df = df.sort_values(by='Project Name')

table_fields = [
    'Quantity',
    'Exchange Rate', 
    'No', 
    'FINANCIAL YEAR', 
    'Currency', 
    'USD Unit Price', 
    'Sales Month & Year', 
    'USD TOTAL PRICE', 
    'SGD Unit Price',
    'Model',
    'Product Type',
    'Delivery Status',
    'Deal No.',
    'P.O. No.',
    'Quarter',
    'Sales Date'
    ]

columns_name = df.columns.to_list()



df.insert(loc=0, column='New Record Flags', value=[''] * len(df))
df['No_t'] = ''


pd.isna
project_name = ''
iter_row = 1
for index, row in df.iterrows():
    # updated quantity if empty
    if pd.isna(df.loc[index, 'Quantity']):
        df.loc[index, 'Quantity'] = 0

    if pd.isna(df.loc[index, 'Currency']):
        df.loc[index, 'Currency'] = 'USD' if row['Region'] != 'Singapore' else 'SGD'

    if pd.isna(df.loc[index, 'FINANCIAL YEAR']):
        df.loc[index, 'FINANCIAL YEAR'] = financial_year(row['Sales Date'])
        
    if project_name != row['Project Name']:
        iter_row = 1
        df.loc[index, 'No_t'] = iter_row
        df.loc[index, 'New Record Flags'] = '*'
        project_name = row['Project Name']
        continue

    iter_row += 1
    df.loc[index, 'No_t'] = iter_row
    for column in columns_name:
        if column not in table_fields:
            df.loc[index, column] = pd.NA

df.to_csv('data/migration_RHQ.csv', index=False, sep='\t', encoding='utf-8')
