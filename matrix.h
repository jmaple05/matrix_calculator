//
// Created by jesse on 2/5/2026.
//
#pragma once

#include <vector>
using std::vector;
#include <iostream>
using std::cin;
using std::cout;
using std::endl;
using std::getline;
using std::cerr;
#include <string>
using std::string;
using std::stoi;
#include <ostream>
using std::ostream;

class Matrix {
public:
    Matrix(const int & num_rows, const int & num_columns, const vector<int> & input) : rows(num_rows), columns(num_columns) {
        int index = 0;
        for (int i = 0; i < rows; i++) {
            vector<int> v(columns);
            matrix.push_back(v);
            for (int j = 0; j < columns; j++) {
                matrix[i][j] = input[index++];
            }
        }
    }
    Matrix(const int & num_rows, const int & num_columns) : rows(num_rows), columns(num_columns) {
        for (int i = 0; i < rows; i++) {
            vector<int> v(columns);
            matrix.push_back(v);
        }
    }
    Matrix() {
        cout << "Rows: ";
        string line;
        getline(cin, line);
        rows = stoi(line);
        cout << "Columns: ";
        getline(cin, line);
        columns = stoi(line);
        for (int i = 0; i < rows; i++) {
            vector<int> v;
            matrix.push_back(v);
            cout << "Row " << i+1 << endl;
            for (int j = 0; j < columns; j++) {
                string num;
                getline(cin, num);
                matrix.at(i).push_back(stoi(num));
            }
        }
    }
    void print_matrix() const {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < columns; j++) {
                cout << get_element(i, j) << " ";
            }
            cout << endl;
        }
    }
    [[nodiscard]] Matrix copy() const {
        Matrix m(rows, columns);
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < columns; j++) {
                m.set_elem(i,j,get_element(i, j));
            }
        }
        return m;
    }
    [[nodiscard]] Matrix transpose() const {
        Matrix m(columns, rows);
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < columns; j++) {
                m.set_elem(j,i,get_element(i, j));
            }
        }
        return m;
    }
    [[nodiscard]] Matrix pow(const int & power) const {
        Matrix m = copy();
        const Matrix n = m.copy();
        for (int i = 1; i < power; i++) {
            m = m * n;
        }
        return m;
    }
    //trace
    [[nodiscard]] int trace() const {
        int trace = 0;
        if (rows != columns) {
            cout << "Must be a square matrix of n x n dimension to use trace()" << endl;
        } else {
            for (int i = 0; i < rows; i++) {
                trace += get_element(i,i);
            }
        } return trace;
    }
    Matrix operator+(const Matrix & add_m) const {
        Matrix m(rows, columns);
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < columns; j++) {
                m.set_elem(i, j, get_element(i, j) + add_m.get_element(i,j));
            }
        }
        return m;
    }
    Matrix operator-(const Matrix & sub_m) const {
        Matrix m(rows, columns);
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < columns; j++) {
                m.set_elem(i, j, get_element(i, j) - sub_m.get_element(i,j));
            }
        }
        return m;
    }
    Matrix operator*(const Matrix & mul_m) const {
        Matrix m(rows, mul_m.get_col_num());
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < mul_m.get_col_num(); j++) {
                int total = 0;
                for (int k = 0; k < columns; k++) {
                    total += get_element(i, k) * mul_m.get_element(k,j);
                }
                m.set_elem(i,j,total);
            }
        }
        return m;
    }
    Matrix operator*(const int & num) const {
        Matrix m(rows, columns);
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < columns; j++) {
                m.set_elem(i,j,get_element(i, j) * num);
            }
        }
        return m;
    }
    ostream& operator>>(ostream & os) const {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < columns; j++) {
                os << get_element(i,j) << " ";
            }
            os << endl;
        }
        return os;
    }
    [[nodiscard]] int get_col_num() const { return columns; }
    [[nodiscard]] int get_row_num() const { return rows; }
    [[nodiscard]] int get_element(const int & x, const int & y) const { return matrix.at(x).at(y); }

private:
    int rows;
    int columns;
    vector<vector<int>> matrix;
    void set_elem(const int & r, const int & c, const int & num) { matrix[r][c] = num; }
};

inline
int determinant(const Matrix& m) {
    if (m.get_row_num() != m.get_col_num()) {
        cerr << "Matrix must be square to take the determinant" << endl;
    }
    if (m.get_row_num() > 2) {
        int matrix_determinant = 0;
        int col_num = m.get_col_num();
        for (int i = 0; i < col_num; i++) { // each item across row 1
            vector<int> vec;
            for (int j = 1; j < col_num; j++) { // each row
                for (int k = 0; k < col_num; k++) { // each column item
                    if (k != i) { vec.push_back(m.get_element(j,k)); } // skips the column to be skipped
                }
            }
            Matrix new_matrix(col_num-1, col_num-1, vec);
            int sign = 1;
            if (i%2 == 1) { sign *= -1; }
            matrix_determinant += (m.get_element(0,i)*determinant(new_matrix)*sign);
        }
        return matrix_determinant;
    } else {
        return (m.get_element(0,0) * m.get_element(1,1)) - (m.get_element(0,1) * m.get_element(1,0));
    }
}