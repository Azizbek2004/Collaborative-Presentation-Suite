function UserPanel({ users, changeRole }) {
  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto border-l border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Team</h2>
      {users.length === 0 ? (
        <p className="text-gray-600">No users yet</p>
      ) : (
        <ul className="space-y-3">
          {users.map((u) => (
            <li
              key={u.nickname}
              className="flex justify-between items-center bg-gray-50 p-2 rounded-lg shadow-sm"
            >
              <span className="text-gray-800">
                {u.nickname} ({u.role})
              </span>
              {u.role !== 'creator' && (
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.nickname, e.target.value)}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserPanel;
