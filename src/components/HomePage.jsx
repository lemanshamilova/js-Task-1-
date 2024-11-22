import { useState } from "react";
import { FaPen } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';
import { MdDone } from "react-icons/md";


const initialTreeData = [
  {
    id: 1,
    label: "Root",
    children: [
      
    ],
  },
];


const TreeNode = ({ node, onAdd, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newLabel, setNewLabel] = useState(node.label);

  const handleSave = () => {
    onEdit(node.id, newLabel);
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <button onClick={handleSave}><MdDone/></button>
          <button onClick={() => setIsEditing(false)}><IoClose/></button>
        </div>
      ) : (
        <div>
          <span>{node.label}</span>
          <button onClick={() => onAdd(node.id)}><FaPlus/></button>
          <button onClick={() => setIsEditing(true)}><FaPen/></button>
          <button onClick={() => onDelete(node.id)}><IoClose/></button>
        </div>
      )}
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const TreeView = () => {
  const [treeData, setTreeData] = useState(initialTreeData);

  const addNode = (parentId) => {
    const newId = uuidv4();
    const newNode = { id: newId, label: "Name", children: [] };

    const addRecursively = (nodes) =>
      nodes.map((node) => {
        if (node.id === parentId) {
          return { ...node, children: [...node.children, newNode] };
        }
        if (node.children) {
          return { ...node, children: addRecursively(node.children) };
        }
        return node;
      });

    setTreeData(addRecursively(treeData));
  };

  const editNode = (nodeId, newLabel) => {
    const editRecursively = (nodes) =>
      nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, label: newLabel };
        }
        if (node.children) {
          return { ...node, children: editRecursively(node.children) };
        }
        return node;
      });

    setTreeData(editRecursively(treeData));
  };

  const deleteNode = (nodeId) => {
    const deleteRecursively = (nodes) =>
      nodes.filter((node) => node.id !== nodeId).map((node) => {
        if (node.children) {
          return { ...node, children: deleteRecursively(node.children) };
        }
        return node;
      });

    setTreeData(deleteRecursively(treeData));
  };

  return (
    <ul>
      {treeData.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onAdd={addNode}
          onEdit={editNode}
          onDelete={deleteNode}
        />
      ))}
    </ul>
  );
};

export default TreeView;
